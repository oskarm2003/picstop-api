import { IncomingMessage, ServerResponse } from "http";
import { createUser, generateToken, getAllUsers, getUserData, userLogin } from "../../model/user/user_model";
import parseRequestData from "../../utils/parse_request._data";
import { cc } from "../../index";
import isEmptyString from "../../utils/isEmptyString";

const userController = async (req: IncomingMessage, res: ServerResponse) => {

    //get users data
    if (req.url === '/user' && req.method === 'GET') {

        cc.notify(' users data requested')

        const output = await getAllUsers()
        res.end(JSON.stringify(output))
        return

    }

    //register a user
    else if (req.url === '/user/new' && req.method === 'POST') {

        cc.notify('user register attempt')

        const data = await parseRequestData(req)
            //errro handling    
            .catch(() => {
                res.statusCode = 400
                res.end()
                return
            })

        //if data format not valid
        if (isEmptyString(data.username, data.email, data.password)) {
            res.statusCode = 418
            res.end('wrong data format, provide {username,email,password}')
            return
        }

        //forbidden username
        const forbidden = ['anonymous', '_shared']
        for (let el of forbidden) {
            if (data.username === el) {
                res.statusCode = 403
                res.end('forbidden username')
                return
            }
        }

        createUser(data)
            .then(result => {
                if (result === 'success') {
                    cc.success('user created')
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
                else if (result === 'wrong data format') {
                    res.statusCode = 418
                    res.end('wrong data format')
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
            //errro handling    
            .catch(() => {
                res.statusCode = 400
                res.end()
                return
            })

        //if wrong data format
        if (isEmptyString(data.password, data.username) && isEmptyString(data.password, data.email)) {
            res.statusCode = 418
            res.end('not enough data')
            return
        }

        userLogin(data)
            .then(async result => {
                if (result === 'authentication failed') {
                    res.statusCode = 401
                }
                else if (result === 'not enough data') {
                    res.statusCode = 418
                }
                else if (result === 'not found') {
                    res.statusCode = 404
                }
                else if (result === 'success') {
                    //successfully logged in
                    if (data.username === undefined) {
                        const user_data = await getUserData({ email: data.email })
                        //on no data
                        if (user_data === null) {
                            res.statusCode = 400
                            res.end('error')
                            return
                        }
                        //on data
                        data.username = user_data.username
                    }
                    const token = generateToken(data.username)
                    if (token === false) {
                        throw 'internal problem - invalid token key'
                    }
                    res.end(token)
                    return
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
    }

}

export default userController