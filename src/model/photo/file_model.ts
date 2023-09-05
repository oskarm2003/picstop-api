import { IncomingMessage } from 'http';
import { cc } from '../..';
import { IncomingForm } from 'formidable';
import { existsSync, readFileSync, renameSync, stat, rmdir, unlink, mkdir, readdir, readFile } from 'fs'
import path from 'path';
import sharp from 'sharp'



//get form data
function formatFormData(req: IncomingMessage): Promise<{ name: string, file_temp_path: string }> {

    return new Promise((resolve, reject) => {
        const form = new IncomingForm({ keepExtensions: true })

        form.parse(req, (err, fields, files) => {

            //error
            if (err) {
                reject(err)
                return
            }

            //too little data
            if (fields.name === undefined || files.file === undefined) {
                reject('not enough input data')
            }

            //format and return
            const output = {
                name: Array.isArray(fields.name) ? fields.name[0] : fields.name,
                file_temp_path: Array.isArray(files.file) ? files.file[0].filepath : files.file.filepath
            }

            resolve(output)

        })
    })
}

//post new image
type t_post_output = { code: number } &
    ({ ok: true, path: string } |
    { ok: false, message: string })

function postImage(file_temp_path: string, name: string, author: string | undefined): Promise<t_post_output> {

    return new Promise(async (resolve) => {

        //specify upload dir
        let upload_dir: string
        if (author === undefined) {
            upload_dir = path.join(global.uploads_path, "_shared")
        }
        else {
            upload_dir = path.join(global.uploads_path, author)
            await createNewAlbum(author).catch(() => {
                resolve({ ok: false, message: 'problem', code: 400 })
                return
            })
        }

        //get extension
        const path_segments = file_temp_path.split('.')
        const extension = path_segments[path_segments.length - 1]

        //check file extension
        const valid_extensions = ['JPG', 'JPEG', 'PNG', 'TIFF']
        let kill = true
        for (let el of valid_extensions) {
            if (extension.toUpperCase() === el) kill = false
        }
        if (kill) {
            resolve({ ok: false, message: 'invalid file extension', code: 422 })
            return
        }

        //check if name taken
        if (existsSync(path.join(upload_dir, name + '.' + extension))) {
            resolve({ ok: false, message: 'name already in use', code: 409 })
            return
        }

        const new_path = path.join(upload_dir, name + '.' + extension)

        if (name.includes('/') || name.includes('\\')) {
            resolve({ ok: false, message: 'wrong filename format', code: 422 })
            return
        }

        //move to the desired album
        renameSync(file_temp_path, new_path)
        if (await scaleDown(new_path)) {
            resolve({ ok: true, path: new_path, code: 201 })
            return
        }

        resolve({ ok: false, message: 'error', code: 400 })
        return
    })
}

//scales down an image to the optimal size
function scaleDown(path: string): Promise<boolean> {

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
function createNewAlbum(name: string): Promise<boolean> {
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
function removeAsset(path: string): Promise<true> {
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
function getImage(name: string, album: string): Promise<t_get_output> {

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

            resolve({ ok: false, code: 404, message: 'file not found' })

        })
    })
}

//deletes the file
function deleteImage(album: string, name: string): Promise<true> {

    return new Promise((resolve, reject) => {

        if (album === 'anonymous') album = '_shared'

        readdir(path.join(global.root_dir, 'dist', 'uploads', album), (err, files) => {

            if (err) {
                reject(err)
                return
            }

            for (let file of files) {
                if (file.startsWith(name)) {
                    removeAsset(path.join(global.root_dir, 'dist', 'uploads', album, file))
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
function cleanUp(album_name?: string): Promise<void> {

    const uploads_path = path.join(global.root_dir, 'dist', 'uploads')

    return new Promise((resolve, reject) => {

        //album name not given
        if (album_name === undefined) {
            readdir(uploads_path, async (err, contents) => {
                if (err) {
                    reject('path does not exist')
                    return
                }
                for (let el of contents) {
                    if (el === '_shared') continue
                    await cleanUp(el).catch(err => cc.error(err))
                }
                resolve()
            })
            return
        }

        //album name given
        readdir(path.join(uploads_path, album_name), (err, files) => {
            if (err || !Array.isArray(files)) {
                reject('could not read contents of ' + album_name)
                return
            }
            if (files.length === 0) {
                rmdir(path.join(uploads_path, album_name), (err) => {
                    if (err) {
                        reject('could not remove ' + album_name)
                        return
                    }
                    resolve()
                })
            }
            else {
                resolve()
            }
        })
    })
}

export { postImage, removeAsset, createNewAlbum, scaleDown, getImage, deleteImage, cleanUp, formatFormData }