import { IncomingMessage, ServerResponse } from "http";
import { get_all_users } from "../../model/users/user_model";
import parseRequestData from "../../utils/parse_request._data";
import { cc } from "../../index";

const userController = async (req: IncomingMessage, res: ServerResponse) => {

    //get users data
    if (req.url === '/user' && req.method === 'GET') {

        const output = get_all_users()
        res.end(output)
        return

    }

    //register a user
    if (req.url === '/user/new' && req.method == 'POST') {

        cc.warn('user')
        const data = await parseRequestData(req)

    }

}

export default userController