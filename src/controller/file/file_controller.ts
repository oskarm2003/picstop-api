import { IncomingMessage, ServerResponse } from "http";
import parseRequestData from "../../utils/parse_request._data";
import { post_image } from "../../model/file/file_model";

const filesController = (req: IncomingMessage, res: ServerResponse) => {

    if (req.url === '/file' && req.method === 'POST') {

        // const data = parseRequestData(req)
        //     //error handling    
        //     .catch(() => {
        //         res.statusCode = 400
        //         res.end()
        //         return
        //     })

        post_image(req)

    }

}

export default filesController