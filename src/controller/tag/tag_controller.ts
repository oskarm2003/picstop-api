import { IncomingMessage, ServerResponse } from "http"
import parseRequestData from "../../utils/parse_request._data"
import { addTag, addTags, countTag, getPhotoTags, getTagged, removeTagFromPhoto } from "../../model/tags/tags_model"
import { cc } from "../.."
import authorize from "../../utils/authorization"
import isEmptyString from "../../utils/isEmptyString"

const tagController = async (req: IncomingMessage, res: ServerResponse) => {

    //add new tag to the photo
    if (req.method == 'POST' && req.url === '/tag') {

        //get data
        let data = await parseRequestData(req)

        //when author arg omitted
        if (data.photo_author === undefined) {
            data.photo_author = 'anonymous'
        }

        //if wrong input format
        if (isEmptyString(data.tag_name, data.photo_name, data.photo_author)) {
            res.statusCode = 422
            res.end('wrong input data format')
            return
        }

        //authortization
        if (authorize(req, res, data.photo_author) === false) return

        //check tag format
        const forbidden_chars = ['/', '\\', '.', ',']
        for (let el of forbidden_chars) {
            if (data.tag_name.includes(el)) {
                res.statusCode = 403
                res.end('forbidden tag format')
                return
            }
        }

        //add tag
        addTag(data.tag_name, data.photo_author, data.photo_name)
            .then(() => {
                res.statusCode = 201
                res.end('success')
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

    //post many tags at once
    if (req.method === 'POST' && req.url === '/tags') {

        //get data
        let data = await parseRequestData(req)

        if (isEmptyString(data.tag_names, data.photo_name, data.photo_author)) {
            res.statusCode = 422
            res.end('wrong input data format')
            return
        }

        //authortization
        if (authorize(req, res, data.photo_author) === false) return


        addTags(data.tag_names, data.photo_author, data.photo_name)
            .then(() => {
                res.end('success')
            })
            .catch(err => {
                console.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }


    //get all photos' names and albums with given tag
    else if (req.method === 'GET' && req.url?.match(/^\/tag\/photos\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const tag_name = decodeURIComponent(req.url).split('/')[3]
        getTagged(tag_name)
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

    //read tags popularity
    else if (req.method === 'GET' && req.url?.match(/^\/tag\/popularity\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const tag_name = decodeURIComponent(req.url).split('/')[3]

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

        const url_segments = decodeURIComponent(req.url).split('/')
        let author = url_segments[2]
        const photo_name = url_segments[3]

        if (author === '_shared') {
            author = 'anonymous'
        }

        if (isEmptyString(author, photo_name)) {
            res.statusCode = 422
            res.end('wrong input')
            return
        }

        getPhotoTags(photo_name, author)
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

    //delete tag from the photo
    else if (req.method === 'DELETE' && req.url?.match(/^\/tag\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const url_segments = decodeURIComponent(req.url).split('/')

        //invalid data in the url
        if (url_segments.length != 5) {
            res.statusCode = 400
            res.end('wrong url input format')
            return
        }

        let photo_author = url_segments[2]
        const photo_name = url_segments[3]
        const tag_name = url_segments[4]

        if (photo_author === '_shared') {
            photo_author = "anonymous"
        }

        if (isEmptyString(photo_author, photo_name, tag_name)) {
            res.statusCode = 422
            res.end('wrong input')
            return
        }

        //remove
        removeTagFromPhoto(tag_name, photo_author, photo_name)
            .then(() => {
                res.statusCode = 204
                res.end()
            })
            .catch((err) => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    else {
        res.statusCode = 404
        res.end('action not found')
    }

}

export default tagController