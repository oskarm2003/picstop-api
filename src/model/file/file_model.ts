import { IncomingMessage } from 'http';
import { cc } from '../..';
import { IncomingForm } from 'formidable';
import { existsSync, readFileSync, renameSync, stat, rmdir, unlink, mkdir, readdir, readFile } from 'fs'
import path from 'path';
import sharp from 'sharp'


//post new image
type t_post_output = { code: number } &
    ({ ok: true, path: string } |
    { ok: false, message: string })

function post_image(req: IncomingMessage, author: string | undefined): Promise<t_post_output> {

    return new Promise(async (resolve) => {

        //specify upload dir
        let upload_dir: string
        if (author === undefined) {
            upload_dir = path.join(global.uploads_path, "_shared")
        }
        else {
            upload_dir = path.join(global.uploads_path, author)
            await create_new_album(author).catch(err => {
                resolve({ ok: false, message: 'problem', code: 400 })
                return
            })
        }

        const form = new IncomingForm({ keepExtensions: true })

        //parse
        form.parse(req, async (err, fields, files) => {

            //error handling
            if (err) {
                cc.error('FILE PARSE ERROR: ', err)
                resolve({ ok: false, message: 'file parse error', code: 400 })
                return
            }

            //validate given data
            if (files.file === undefined || fields.name === 'undefined') {
                resolve({ ok: false, message: 'not enough data', code: 418 })
                return
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file
            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name

            //get extension
            let path_arr = file.originalFilename?.split('.')
            if (!Array.isArray(path_arr)) {
                resolve({ ok: false, message: 'wrong data format', code: 418 })
                return
            }
            let extension = path_arr[path_arr?.length - 1]

            //check file extension
            if (extension.toUpperCase() != 'JPG' && extension.toUpperCase() != 'JPEG' && extension.toUpperCase() != 'PNG' && extension.toUpperCase() != 'TIFF') {
                resolve({ ok: false, message: 'wrong data format', code: 418 })
                return
            }

            //check if name taken
            if (existsSync(path.join(upload_dir, name + '.' + extension))) {
                resolve({ ok: false, message: 'name already in use', code: 409 })
                return
            }

            const new_path = path.join(upload_dir, name + '.' + extension)

            if (name.includes('/') || name.includes('\\')) {
                resolve({ ok: false, message: 'wrong data format', code: 418 })
                return
            }

            //move to the desired album
            renameSync(file.filepath, new_path)
            if (await scale_down(new_path)) {
                resolve({ ok: true, path: new_path, code: 201 })
                return
            }

            resolve({ ok: false, message: 'error', code: 400 })
            return
        })
    })

}

//scales down an image to the optimal size
function scale_down(path: string): Promise<boolean> {

    //desired width
    const desired_width = 1000

    return new Promise((resolve) => {

        //check if exists
        if (!existsSync(path)) {
            resolve(false)
            return
        }

        //scale down if necessary
        const file = readFileSync(path)
        sharp(file).metadata((err, metadata) => {

            //error handling
            if (err) {
                cc.error(err)
                resolve(false)
                return
            }
            else if (metadata.width === undefined) {
                resolve(false)
                return
            }

            //check if resize necessary
            if (metadata.width < desired_width) {
                resolve(true)
                return
            }

            //resize
            sharp(file).resize({ width: 500 }).toFile(path)
                .catch(err => {
                    cc.error(err)
                    resolve(false)
                })
                .then(() => resolve(true))
        })
    })
}

//create new album within the uploads directory
function create_new_album(name: string): Promise<boolean> {
    const album = path.join(global.uploads_path, name)
    return new Promise((resolve) => {
        if (!existsSync(album)) {
            mkdir(album, (err) => {
                if (err) {
                    cc.error(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        }
        else {
            resolve(false)
        }
    })
}

//remove file or directory
function remove_asset(path: string): Promise<true> {
    return new Promise((resolve, reject) => {

        if (!existsSync(path)) reject('does not exist')
        stat(path, (err, stats) => {
            if (err) {
                reject(err)
                return
            }
            //handle directory
            if (stats.isDirectory()) {
                rmdir(path, (err) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true)
                })
            }
            //handle file
            else {
                unlink(path, (err) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(true)
                })
            }
        })
    })
}

//returns a photo file by given name
type t_get_output = { code: number } & ({ ok: true, file: Buffer } | { ok: false, message: string })
function get_image(name: string, album: string): Promise<t_get_output> {

    return new Promise((resolve) => {
        //find the photo in the album
        readdir(path.join(global.root_dir, 'dist', 'uploads', album), (err, files) => {

            if (err) {
                cc.error('album not found')
                resolve({ ok: false, message: 'album not found', code: 404 })
                return
            }

            //look for a file
            for (let file of files) {

                //if found
                if (file.startsWith(name)) {
                    console.log(path.join(global.root_dir, 'dist', 'uploads', album, file));

                    readFile(path.join(global.root_dir, 'dist', 'uploads', album, file), (err, data) => {

                        if (err) {
                            cc.error('file not found')
                            resolve({ ok: false, message: 'file not found', code: 404 })
                        }

                        //on data download
                        resolve({ ok: true, code: 200, file: data })

                    })
                    return
                }
            }

            resolve({ ok: false, code: 400, message: 'error' })

        })
    })
}

//deletes the file
function deleteImage(album: string, name: string): Promise<true> {

    return new Promise((resolve, reject) => {

        readdir(path.join(global.root_dir, 'dist', 'uploads', album), (err, files) => {

            if (err) {
                reject(err)
                return
            }

            for (let file of files) {
                if (file.startsWith(name)) {
                    remove_asset(path.join(global.root_dir, 'dist', 'uploads', album, file))
                        .then(() => {
                            cleanUp(album)
                            resolve(true)
                        })
                        .catch(err => {
                            reject(err)
                            return
                        })
                    return
                }
            }
            reject('no file found')
        })
    })
}

//cleans up all empty albums or single album given in the input if empty
function cleanUp(album_name?: string) {

    const uploads_path = path.join(global.root_dir, 'dist', 'uploads')

    return new Promise((resolve) => {

        //album name not given
        if (album_name === undefined) {
            readdir(uploads_path, async (err, contents) => {
                if (err) return
                for (let el of contents) {
                    if (el === '_shared') continue
                    await cleanUp(el)
                }
                resolve(true)
            })
            return
        }

        //album name given
        readdir(path.join(uploads_path, album_name), (err, files) => {
            if (err || !Array.isArray(files)) return
            if (files.length === 0) {
                rmdir(path.join(uploads_path, album_name), () => {
                    resolve(true)
                })
            }
        })
    })
}

export { post_image, remove_asset, create_new_album, scale_down, get_image, deleteImage, cleanUp }