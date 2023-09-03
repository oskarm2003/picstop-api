import { IncomingMessage, ServerResponse } from "http";
import { cleanUp, deleteImage, getImage, postImage, removeAsset } from "../../model/photo/file_model";
import { authorizeUser } from "../../model/user/user_model";
import { createDescriptor, deleteDescriptor, readDescriptor } from "../../model/photo/descriptor_model";
import { cc } from "../..";
import { removeAllTags } from "../../model/tags/tags_model";
import isEmptyString from "../../utils/isEmptyString";

const fileController = async (req: IncomingMessage, res: ServerResponse) => {

    //POST a new photo
    if (req.method === 'POST' && req.url === '/photo') {

        cc.notify('post image')

        //user authorization
        let author
        if (req.headers.authorization) {
            const authorization = authorizeUser(req)
            //if authorization failed
            if (!authorization) {
                res.statusCode = 401
                res.end('authorization failed')
                return
            }
            author = authorization
        }

        const result = await postImage(req, author)
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
                removeAsset(result.path)
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
    else if (req.method === 'GET' && req.url?.match(/^\/photo\/descriptor(\/(.(?!\\))*)?$/gm)) {

        //handle the url
        const url_segments = req.url.split('/')
        if (url_segments.length > 5) {
            res.statusCode = 418
            res.end('too many arguments')
            return
        }
        let album = url_segments[3]
        const file_name = url_segments[4]

        if (album === undefined) {
            album = '_shared'
        }

        readDescriptor(album, file_name)
            .then(data => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 404
                res.end('error')
            })
    }

    //GET photo by given name
    else if (req.method === 'GET' && req.url?.match(/^\/photo\/file\/(.(?!\\))*$/gm)) {

        const url_segments = req.url.split('/')
        if (url_segments.length > 5) {
            res.statusCode = 418
            res.end('too many arguments')
            return
        }

        //check the data format in the url
        let file_name, album
        if (url_segments.length === 5) {
            file_name = url_segments[4]
            album = url_segments[3]
        }
        else {
            file_name = url_segments[3]
            album = '_shared'
        }

        if (isEmptyString(file_name, album)) {
            res.statusCode = 422
            res.end('wrong input')
            return
        }

        const result = await getImage(file_name, album)

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
    else if (req.method === 'DELETE' && req.url?.match(/^\/photo\/(.(?!\\))*$/gm)) {

        //authorize the operation
        let user: string
        if (req.headers.authorization) {
            const authorization = authorizeUser(req)
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
            res.statusCode = 422
            res.end('wrong input format')
            return
        }

        if (url_segments[2] != user) {
            res.statusCode = 401
            res.end('authorization failed')
            return
        }

        if (isEmptyString(url_segments[2], url_segments[3])) {
            res.statusCode = 422
            res.end('wrong input')
            return
        }

        //delete photo's descriptor
        deleteDescriptor(url_segments[2], url_segments[3])
            .then(async () => {

                //delete image
                await deleteImage(url_segments[2], url_segments[3])
                    .then(async () => {

                        //delete tags
                        //TODO: delete by the id
                        await removeAllTags(0)
                            .then(() => {

                                //TODO: delete comments

                                res.statusCode = 204
                                res.end()
                            })
                    })
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //clean up
    else if (req.url === '/photo' && req.method === 'DELETE') {
        cleanUp()
        res.statusCode = 204
        res.end()
    }

    else {
        res.statusCode = 404
        res.end('action not found')
    }

}

export default fileController