import { IncomingMessage, ServerResponse } from "http";
import { get_all_users } from "../../model/users/user_model";
import parseRequestData from "../../utils/parse_request._data";
import { cc } from "../../index";

const userController = async (req: IncomingMessage, res: ServerResponse) => {

    cc.notify('user branch activated')

    //get users data
    if (req.url === '/user' && req.method === 'GET') {

        cc.notify('users data requested')

        const output = get_all_users()
        res.end(output)
        return

    }

    //register a user
    if (req.url === '/user/new' && req.method == 'POST') {

        cc.notify('user register attempt')

        const data = await parseRequestData(req)
        cc.log(data)

    }

}

export default userController