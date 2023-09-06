import { IncomingMessage, ServerResponse } from "http";
import { createUser, deleteUser, generateToken, getAllUsers, getUserData, userLogin } from "../../model/user/user_model";
import parseRequestData from "../../utils/parse_request._data";
import { cc } from "../../index";
import isEmptyString from "../../utils/isEmptyString";
import { changeForgottenPassword, requestPasswordChange } from "../../model/user/password_change_model";
import { prepareVerification, verifyEmail } from "../../model/user/email_verification";
import authorize from "../../utils/authorization";
import { deleteTagsByPhotoAuthor } from "../../model/tags/tags_model";
import { deleteDescriptorsByAuthor } from "../../model/photo/descriptor_model";

const userController = async (req: IncomingMessage, res: ServerResponse) => {

    //get users data
    if (req.method === 'GET' && req.url === '/user') {

        cc.notify(' users data requested')

        await getAllUsers()
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

    //register a user
    else if (req.method === 'POST' && req.url === '/user/new') {

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
    else if (req.method === 'POST' && req.url === '/user/login') {

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

    else if (req.method === 'POST' && req.url === '/user/prepare_verification') {

        //get and validate data
        const data = await parseRequestData(req)
        if (isEmptyString(data.email)) {
            res.statusCode = 422
            res.end('invalid input')
            return
        }

        //check if user with given email exists
        const user = await getUserData({ email: data.email })
        if (user === null) {
            res.statusCode = 404
            res.end('account not found')
            return
        }

        //proceed
        //set url (no ssl connection)
        prepareVerification(data.email)
            .then(() => {
                res.statusCode = 204
                res.end()
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end()
            })

    }

    else if (req.method === 'GET' && req.url?.match(/^\/user\/verify\/(.(?!\\)(?!\/))+$/)) {

        const token = req.url.split('/')[3]
        verifyEmail(token)
            .then(() => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end('<h1 style="text-align:center;margin:5vh;color:#4f4f4f; font-size:5vh">Account verified ✅</h1>')
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
            })
    }

    else if (req.method === 'POST' && req.url === '/user/change_password/request') {

        //get and validate data
        const data = await parseRequestData(req)
        if (isEmptyString(data.email)) {
            res.statusCode = 422
            res.end('invalid input')
            return
        }

        //proceed
        requestPasswordChange(data.email)
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

    else if (req.method === 'PATCH' && req.url === '/user/change_password/forgotten') {

        //get and validate data
        const data = await parseRequestData(req)
        if (isEmptyString(data.token, data.password)) {
            res.statusCode = 422
            res.end('invalid input')
            return
        }

        //proceed
        changeForgottenPassword(data.token, data.password)
            .then(data => {
                if (data === 'expired') {
                    res.statusCode = 498
                    res.end('expired')
                    return
                }
                res.statusCode = 204
                res.end()
            })
            .catch(err => {
                cc.error(err)
                res.statusCode = 400
                res.end()
            })

    }

    //delete user and all corresponding data
    else if (req.method === 'DELETE' && req.url?.match(/^\/user\/(.(?!\\)(?!\/))+$/)) {

        //authorize the user
        const username = req.url.split('/')[2]
        if (!authorize(req, res, username)) {
            return
        }

        //proceed
        Promise.all([
            deleteTagsByPhotoAuthor(username),
            deleteDescriptorsByAuthor(username),
            deleteUser(username)
        ])
            .then(() => {
                res.statusCode = 204
                res.end()
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