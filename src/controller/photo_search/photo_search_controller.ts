import { IncomingMessage, ServerResponse } from "http"
// import isEmptyString from "../../utils/isEmptyString";
import { getEveryNthId, searchByAuthor } from "../../model/photo_search_model.ts/photo_search_model";

const photoSearchController = async (req: IncomingMessage, res: ServerResponse) => {

    // console.log('search');

    if (req.method != 'GET') {
        res.statusCode = 404
        res.end('action not found')
    }

    //search by author
    if (req.url?.match(/^\/photo\/search\/author\/(.(?!\\)(?!\.)(?!,))+$/)) {

        const author = req.url.split('/')[4]

        searchByAuthor(author)
            .then(data => {
                res.statusCode = 200
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                console.error(err)
                res.statusCode = 400
                res.end("error")
            })

    }

    //search by id modulo
    if (req.url?.match(/^\/photo\/search\/moduloid\/[0-9]+\/[0-9]+\/[0-9]+$/)) {

        const [origin, n, limit] = req.url.split('/').splice(4, 3)

        getEveryNthId(parseInt(origin), parseInt(n), parseInt(limit))
            .then(data => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
                return
            })
            .catch(err => {
                console.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }
}

export default photoSearchController