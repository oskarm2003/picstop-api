import { IncomingMessage, ServerResponse } from "http";
import { cleanUp, deleteImage, get_image, post_image, remove_asset } from "../../model/file/file_model";
import { authorize_user } from "../../model/user/user_model";
import { createDescriptor, deleteDescriptor, readDescriptor } from "../../model/file/descriptor_model";
import { cc } from "../..";

const fileController = async (req: IncomingMessage, res: ServerResponse) => {

    //POST a new photo
    if (req.method === 'POST' && req.url === '/file') {

        cc.notify('post image')

        //user authorization
        let author
        if (req.headers.authorization) {
            const authorization = authorize_user(req)
            //if authorization failed
            if (!authorization) {
                res.statusCode = 401
                res.end('authorization failed')
                return
            }
            author = authorization
        }

        const result = await post_image(req, author)
        res.statusCode = result.code

        //if result not ok
        if (!result.ok) {
            res.end(result.message)
            return
        }

        createDescriptor(result.path)
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('description error')
                remove_asset(result.path)
                    .catch(err => {
                        cc.error(err)
                    })
            })
            .then(() => {
                res.end('photo posted')
                cc.success('image successfully posted')
            })

    }

    //GET the photo descriptors
    else if (req.method === 'GET' && req.url?.match(/^\/file\/descriptor\/(.(?!\\))*$/gm)) {

        //handle the url
        const url_segments = req.url.split('/')
        if (url_segments.length > 5) {
            res.statusCode = 418
            res.end('too many arguments')
            return
        }
        const author = url_segments[3]
        const file_name = url_segments[4]

        readDescriptor(author, file_name)
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
            .then(data => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            })

    }

    //GET photo by given name
    else if (req.method === 'GET' && req.url?.match(/^\/file\/(.(?!\\))*$/gm)) {

        const url_segments = req.url.split('/')
        if (url_segments.length > 4) {
            res.statusCode = 418
            res.end('too many arguments')
            return
        }

        //check the data format in the url
        let file_name, album
        if (url_segments.length === 4) {
            file_name = url_segments[3]
            album = url_segments[2]
        }
        else {
            file_name = url_segments[2]
            album = 'shared'
        }

        const result = await get_image(file_name, album)

        //after result
        res.statusCode = result.code

        if (result.ok) {
            res.setHeader('Content-Type', 'image/jpeg')
            res.end(result.file)
            return
        }

        res.end(result.message)
    }

    //DELETE photo
    if (req.method === 'DELETE' && req.url?.match(/^\/file\/(.(?!\\))*$/gm)) {

        //authorize the operation
        let user: string
        if (req.headers.authorization) {
            const authorization = authorize_user(req)
            //if authorization failed
            if (!authorization) {
                res.statusCode = 401
                res.end('authorization failed')
                return
            }
            user = authorization
        }
        else {
            res.statusCode = 401
            res.end('authorization failed')
            return
        }

        const url_segments = req.url.split('/')
        if (url_segments.length != 4) {
            res.statusCode = 400
            res.end('wrong arguments format')
            return
        }

        if (url_segments[2] != user) {
            res.statusCode = 401
            res.end('authorization failed')
            return
        }

        //delete photo's descriptor
        deleteDescriptor(url_segments[2], url_segments[3])
            .then(async () => {

                //delete image
                return await deleteImage(url_segments[2], url_segments[3])
                    .then(() => {
                        res.statusCode = 204
                        res.end()
                    })

            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    if (req.url === '/file' && req.method === 'DELETE') {
        cleanUp()
        res.statusCode = 204
        res.end()
    }

}

export default fileController