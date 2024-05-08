import { IncomingMessage, ServerResponse } from "http";
import { cleanUp, deleteImage, formatFormData, getImage, postImage, removeAsset } from "../../model/photo/file_model";
import { createDescriptor, deleteDescriptor, getRandomDescriptors, readDescriptor } from "../../model/photo/descriptor_model";
import { cc } from "../..";
import { removeAllTags } from "../../model/tags/tags_model";
import isEmptyString from "../../utils/isEmptyString";
import authorize from "../../utils/authorization";
import { deleteAllComments } from "../../model/comments/comments_model";

const photoController = async (req: IncomingMessage, res: ServerResponse) => {

    //POST a new photo
    if (req.method === 'POST' && req.url === '/photo') {

        //user authorization
        let author
        if (req.headers.authorization?.startsWith('Bearer ')) {
            author = authorize(req, res)
            if (typeof author != 'string') return
        }

        const data = await formatFormData(req)
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
                return
            })

        if (typeof data != 'object') {
            res.statusCode = 400
            res.end('error')
            return
        }

        //check data format
        const forbidden_chars = [' ', '.', '/', '\\', ',']
        for (let char of forbidden_chars) {
            if (data.name.includes(char)) {
                res.statusCode = 422
                res.end('forbidden name')
                return
            }
        }

        postImage(data.file_temp_path, data.name, author)
            .then(data => {

                //on fail
                if (!data.ok) {
                    res.statusCode = data.code
                    res.end(data.message)
                    return
                }

                createDescriptor(data.path)
                    .then(() => {
                        res.statusCode = 201
                        res.end('success')
                        return
                    })
                    .catch(async () => {
                        await removeAsset(data.path)
                        throw 'descriptor not created'
                    })
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //GET random descriptors
    else if (req.method === 'GET' && req.url?.match(/^\/photo\/descriptor\/random\/[0-9]+$/)) {

        let cuantity = parseInt(req.url.split('/')[4])
        //cuantity max 60
        if (cuantity > 60) cuantity = 60
        getRandomDescriptors(cuantity)
            .then(data => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //GET the photo descriptors
    else if (req.method === 'GET' && req.url?.match(/^\/photo\/descriptor(\/(.(?!\\))*)?$/gm)) {

        //handle the url
        const url_segments = decodeURIComponent(req.url).split('/')
        if (url_segments.length > 5) {
            res.statusCode = 422
            res.end('too many arguments')
            return
        }
        let album = url_segments[3]
        const file_name = url_segments[4]

        if (album === 'anonymous') {
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

        const url_segments = decodeURIComponent(req.url).split('/')
        if (url_segments.length > 5) {
            res.statusCode = 422
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

        if (album === 'anonymous') {
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

        const url_segments = req.url.split('/')
        if (url_segments.length != 4) {
            res.statusCode = 422
            res.end('wrong input format')
            return
        }

        if (isEmptyString(url_segments[2], url_segments[3])) {
            res.statusCode = 422
            res.end('wrong input')
            return
        }

        //authorization (no anonymous)
        if (url_segments[2] != "anonymous" && authorize(req, res, url_segments[2]) === false) return


        //delete photo and all corresponding data
        Promise.all([
            removeAllTags(url_segments[2], url_segments[3]).catch(err => cc.error(err)),
            deleteAllComments(url_segments[2], url_segments[3]).catch(err => cc.error(err)),
            deleteImage(url_segments[2], url_segments[3]).catch(err => cc.error(err)),
            deleteDescriptor(url_segments[2], url_segments[3]).catch(err => { cc.error(err); throw new Error("photo descriptor not found") }),
        ])
            .then(() => {
                res.statusCode = 204
                res.end()
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
            .catch(err => {
                cc.error(err)
            })
        res.statusCode = 204
        res.end()
    }

    else {
        res.statusCode = 404
        res.end('action not found')
    }

}

export default photoController