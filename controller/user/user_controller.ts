import { IncomingMessage, ServerResponse } from "http";
import { get_all_users } from "../../model/users/user_model";

const userController = (req: IncomingMessage, res: ServerResponse) => {

    //get users data
    if (req.url?.startsWith('/user') && req.method === 'GET') {

        const output = get_all_users()

        res.end(output)
        return

    }

}

export default userController