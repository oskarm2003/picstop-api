import { IncomingMessage, ServerResponse } from "http";
import parseRequestData from "../../utils/parse_request._data";
import { post_image, remove_photo } from "../../model/file/file_model";
import { authorize_user } from "../../model/user/user_model";
import { createDecriptor } from "../../model/file/descriptor_model";
import { cc } from "../..";

const fileController = async (req: IncomingMessage, res: ServerResponse) => {

    if (req.url === '/file' && req.method === 'POST') {

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

        if (await createDecriptor(result.path)) {
            res.end('photo posted')
            cc.success('image successfully posted')
        }
        else {
            res.statusCode = 400
            res.end()
            remove_photo(result.path)
        }

    }

}

export default fileController