import { IncomingMessage } from 'http';
import { cc } from '../..';
import { IncomingForm } from 'formidable';
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFile } from 'fs'
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
            upload_dir = path.join(__dirname, "uploads", "shared")
        }
        else {
            upload_dir = path.join(__dirname, "uploads", author)
            create_new_album(author)
        }

        const form = new IncomingForm({ keepExtensions: true })

        //parse
        form.parse(req, async (err, fields, files) => {

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

            const new_path = path.join(upload_dir, name + '.' + extension)

            if (name.includes('/') || name.includes('\\')) {
                resolve({ ok: false, message: 'wrong data format', code: 418 })
                return
            }

            //TODO: scale down the image

            //move to the desired album
            renameSync(file.filepath, new_path)
            if (await scale_down(new_path)) {
                resolve({ ok: true, path: new_path, code: 201 })
                return
            }

            resolve({ ok: false, message: 'posting error', code: 400 })
            return

        })
    })

}

//scales down an image to the friendly size
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
function create_new_album(name: string): void {
    const album = path.join(__dirname, "uploads", name)
    if (!existsSync(album)) {
        mkdirSync(album)
    }
}

//remove photo
function remove_photo(url: string) {
    if (!existsSync(url)) return
    unlinkSync(url)
}

export { post_image, remove_photo }