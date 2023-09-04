import { IncomingMessage, ServerResponse } from "http"
import parseRequestData from "../../utils/parse_request._data"
import isEmptyString from "../../utils/isEmptyString"
import { addComment, deleteComment, editComment, getComments } from "../../model/comments/comments_model"
import { cc } from "../.."
import authorize from "../../utils/authorization"

const commentsController = async (req: IncomingMessage, res: ServerResponse) => {

    //add new comment
    if (req.method === 'POST' && req.url === '/comment') {

        //authorization
        const response = authorize(req, res)
        if (typeof response != 'string') {
            return
        }


        //get and validate incoming data
        const data = await parseRequestData(req)

        if (isEmptyString(data.photo_author, data.photo_name, response, data.content)) {
            res.statusCode = 422
            res.end('wrong input format')
            return
        }

        //add comment
        addComment(data.photo_author, data.photo_name, response, data.content)
            .then(data => {
                if (data === 'not found') {
                    res.statusCode = 404
                }
                else if (data === 'exists') {
                    res.statusCode = 409
                }
                else if (data === 'success') {
                    res.statusCode = 201
                }
                res.end(data)
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //get all photo's comments
    else if (req.method === 'GET' && req.url?.match(/^\/comment\/(.(?!\\)(?!\.)(?!,))+\/(.(?!\\)(?!\.)(?!,))+$/)) {

        //get and validate data
        const url_segments = req.url.split('/')
        let photo_author = url_segments[2]
        const photo_name = url_segments[3]

        if (isEmptyString(photo_author, photo_name)) {
            res.statusCode = 422
            res.end('wrong input format')
            return
        }

        //if anonymous
        if (photo_author === '_shared') {
            photo_author = 'anonymous'
        }

        //view comments
        getComments(photo_author, photo_name)
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

    //update comment's content
    else if (req.method === 'PATCH' && req.url === '/comment') {

        //get and validate data
        const data = await parseRequestData(req)

        if (isEmptyString(data.comment_id, data.content)) {
            res.statusCode = 422
            res.end('wrong input format')
            return
        }

        const author = authorize(req, res)
        if (typeof author != 'string') { return }

        //update comment
        editComment(data.comment_id, author, data.content)
            .then(data => {
                if (data === 'not found') {
                    res.statusCode = 404
                    res.end('not found')
                    return
                }
                res.statusCode = 204
                res.end()
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    //delete comment
    else if (req.method === 'DELETE' && req.url?.match(/^\/comment\/(.(?!\\)(?!\.)(?!,))+$/)) {

        //get and validate data
        let comment_id: string | number = req.url.split('/')[2]

        try {
            comment_id = parseInt(comment_id)
        } catch (error) {
            res.statusCode = 422
            res.end('wrong input type')
            return
        }

        const author = authorize(req, res)
        if (typeof author != 'string') {
            return
        }

        deleteComment(comment_id, author)
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

    else {
        res.statusCode = 404
        res.end('action not found')
    }

}

export default commentsController