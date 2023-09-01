import { IncomingMessage, ServerResponse } from "http"
import parseRequestData from "../../utils/parse_request._data"
import { addTag, countTag, getPhotoTags, getTagged, removeTagFromPhoto } from "../../model/about_files/tags_model"
import { cc } from "../.."
import { readDescriptor } from "../../model/file/descriptor_model"
import authorize from "../../utils/authorization"

const tagController = async (req: IncomingMessage, res: ServerResponse) => {

    //add new tag to the photo
    if (req.method == 'POST' && req.url === '/tag') {

        //get data
        let data = await parseRequestData(req)

        //if wrong input format
        if (typeof data.tag_name != 'string' || typeof data.photo_name != 'string' || typeof data.author != 'string') {
            res.statusCode = 418
            res.end('wrong input data format')
            return
        }

        //authortization
        let album = '_shared'
        if (data.author != 'anonymous' && data.author != '_shared') {
            if (!authorize(req, res, data.author)) return
            album = data.author
        }

        //check tag format
        const forbidden_chars = ['/', '\\', '.', ',']
        for (let el of forbidden_chars) {
            if (data.tag_name.includes(el)) {
                res.statusCode = 403
                res.end('forbidden tag format')
                return
            }
        }

        //get photo id
        readDescriptor(album, data.photo_name)
            .then(async result => {
                if (Array.isArray(result)) {
                    throw 'error'
                }
                await addTag(data.tag_name, result.id)
                    .then(() => {
                        res.statusCode = 201
                        res.end('success')
                    })
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                if (err === 'tag already exists in this photo') {
                    res.end('already exists')
                    return
                }
                res.end('error')
            })
    }

    //get all photos' names and albums with given tag
    else if (req.method === 'GET' && req.url?.match(/^\/tag\/photos\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const tag_name = req.url.split('/')[3]
        getTagged(tag_name)
            .then(data => {
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })

    }

    //read tags popularity
    else if (req.method === 'GET' && req.url?.match(/^\/tag\/popularity\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const tag_name = req.url.split('/')[3]

        countTag(tag_name)
            .then(data => {
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 404
                res.end('tag not found')
            })
    }

    //get photo's tags
    else if (req.method === 'GET' && req.url?.match(/^\/tags\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const url_segments = req.url.split('/')
        const album_name = url_segments[2]
        const photo_name = url_segments[3]

        readDescriptor(album_name, photo_name)
            .then(data => {
                if (Array.isArray(data)) {
                    res.statusCode = 404
                    res.end('photo does not exist')
                    return
                }
                getPhotoTags(data.id)
                    .then(data => {
                        res.end(JSON.stringify(data))
                    })
            })

            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //delete tag from the photo
    else if (req.method === 'DELETE' && req.url?.match(/^\/tag\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const url_segments = req.url.split('/')

        //invalid data in the url
        if (url_segments.length != 5) {
            res.statusCode = 400
            res.end('wrong url input format')
            return
        }

        const album_name = url_segments[2]
        const photo_name = url_segments[3]
        const tag_name = url_segments[4]

        //get photo id
        readDescriptor(album_name, photo_name)
            .then(data => {
                if (Array.isArray(data)) {
                    throw 'photo not found'
                }

                //authorization
                if (!authorize(req, res, data.author) && data.album != '_shared') {
                    return
                }

                removeTagFromPhoto(tag_name, data.id)
                    .then(() => res.end('success'))
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

}

export default tagController