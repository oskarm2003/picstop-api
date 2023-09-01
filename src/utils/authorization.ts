import { IncomingMessage, ServerResponse } from "http"
import { authorize_user } from "../model/user/user_model"

//authorization
const authorize = (req: IncomingMessage, res: ServerResponse, who?: string): boolean | string => {

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.statusCode = 401
        res.end('authorization failed')
        return false
    }

    let authorization = authorize_user(req)
    if (!authorization) {
        res.statusCode = 401
        res.end('authorization failed')
        return false
    }

    if (who === undefined) {
        return authorization
    }

    if (who === authorization) {
        return true
    }

    res.statusCode = 403
    res.end('authorization failed')
    return false

}

export default authorize