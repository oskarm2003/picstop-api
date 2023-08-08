import { IncomingMessage, ServerResponse } from "http";
import { create_user, get_all_users, t_user, user_login } from "../../model/users/user_model";
import parseRequestData from "../../utils/parse_request._data";
import { cc } from "../../index";

const userController = async (req: IncomingMessage, res: ServerResponse) => {

    cc.notify('user branch activated')

    //get users data
    if (req.url === '/user' && req.method === 'GET') {

        cc.notify(' users data requested')

        const output = await get_all_users()
        res.end(JSON.stringify(output))
        return

    }

    //register a user
    else if (req.url === '/user/new' && req.method === 'POST') {

        cc.notify('user register attempt')

        const data = await parseRequestData(req)

        //if data format not valid
        if (data.username === undefined || data.email === undefined || data.password === undefined) {
            res.statusCode = 418
            res.end('wrong data format, provide {username,email,password}')
            return
        }

        create_user(data)
            .then(result => {
                if (result === 'success') {
                    res.statusCode = 201
                    res.end('user succesfully created')
                }
                else if (result === 'taken') {
                    res.statusCode = 409
                    res.end('username or email already in use')
                }
                else if (result === 'error') {
                    res.statusCode = 400
                    res.end('error')
                }
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end()
            })
    }

    //login a user
    else if (req.url === '/user/login' && req.method === 'POST') {

        cc.notify('user login attempt')

        const data = await parseRequestData(req)

        //if wrong data format
        if (data.password === undefined || (data.username === undefined && data.email === undefined)) {
            res.statusCode = 418
            res.end('not enough data')
        }

        user_login(data)
            .then(result => {
                if (result === 'authorization failed') {
                    res.statusCode = 401
                }
                else if (result === 'not enough data') {
                    res.statusCode = 418
                }
                else if (result === 'not found') {
                    res.statusCode = 404
                }
                res.end(result)
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end()
            })

    }

    //url not found
    else {
        res.statusCode = 404
        res.end('action not found')
        return
    }

}

export default userController