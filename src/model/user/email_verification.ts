import { cc } from "../..";
import Mailer from "../../utils/mailer";
import { dbQuery } from "../database/database_model";
import * as jwt from 'jsonwebtoken'

function prepareVerification(email: string): Promise<void> {

    return new Promise((resolve, reject) => {

        //tokenize email
        const token_key = process.env.TOKEN_KEY
        if (token_key === undefined) { reject('undefined token key'); return }
        const token = jwt.sign({ email: email }, token_key, { expiresIn: '1h' })

        //send verification mail
        Mailer.send.verification(email, global.server_url + '/user/verify/' + token)
            .then(data => {
                cc.notify(data)
                resolve()
            })
            .catch(err => reject(err))
    })

}

function verifyEmail(token: string): Promise<void> {

    return new Promise((resolve, reject) => {

        //decode the token
        let decoded
        try {
            const token_key = process.env.TOKEN_KEY
            if (typeof token_key != 'string') {
                reject('could not get token key')
                return
            }
            decoded = jwt.verify(token, token_key)
        } catch (err) {
            reject(err)
            return
        }

        if (typeof decoded != 'object' || decoded.email === undefined) {
            reject('invalid token data')
            return
        }

        const email = decoded.email

        //make the query
        dbQuery(`UPDATE users SET verified=1 WHERE email='${email}'`)
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

export { verifyEmail, prepareVerification }