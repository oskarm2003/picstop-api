import { cc } from "../..";
import CryptoMachine from "../../utils/crypto_machine";
import Mailer from "../../utils/mailer";
import { dbQuery } from "../database/database_model";
import * as jwt from 'jsonwebtoken'

function requestPasswordChange(email: string): Promise<void> {

    return new Promise((resolve, reject) => {

        //check if verified
        dbQuery(`SELECT verified FROM users WHERE (email='${email}')`)
            .then(data => {
                //verify data
                if (!Array.isArray(data)) {
                    reject('invalid database query result')
                    return
                }
                if (data.length === 0) {
                    reject('user not found')
                    return
                }
                if (data[0].verified === 0) {
                    reject('account is not verified')
                    return
                }

                const token_key = process.env.TOKEN_KEY_PASSWORD_CHANGE
                if (token_key === undefined) {
                    reject('could not get the token key')
                    return
                }
                const token = jwt.sign({ email: email }, token_key, { expiresIn: '5m' })

                Mailer.send.password_change(email, global.server_url + '/password_change/' + token)
                    .then(data => {
                        cc.notify(data)
                        resolve()
                    })
            })
            .catch(err => reject(err))
    })
}

function changeForgottenPassword(token: string, password: string): Promise<'success' | 'expired'> {

    return new Promise((resolve, reject) => {

        //decode
        let decoded
        try {
            const token_key = process.env.TOKEN_KEY_PASSWORD_CHANGE
            if (typeof token_key != 'string') {
                reject('could not get token key')
                return
            }
            decoded = jwt.verify(token, token_key)
        } catch (err) {
            if (err instanceof Error) {
                if (err.name === 'TokenExpiredError') {
                    resolve('expired')
                    return
                }
            }
            reject(err)
            return
        }

        if (typeof decoded != 'object' || decoded.email === undefined) {
            reject('invalid token data')
            return
        }

        const email = decoded.email
        //hash a password
        let hashed_password = CryptoMachine.generate_hash(password)

        dbQuery(`SELECT update_timestamp FROM users WHERE email='${email}'`)
            .then(data => {
                if (!Array.isArray(data)) {
                    throw 'invalid database output'
                }
                if (data.length === 0 || data[0].update_timestamp === undefined) {
                    throw 'user with given email not found'
                }

                //updates frequency restriction (5 minutes)
                if (data[0].update_timestamp + 300000 > Date.now()) {
                    throw 'last update too recent'
                }

                let date = Date.now()
                return dbQuery(`UPDATE users SET password='${hashed_password}', update_timestamp='${date}' WHERE email='${email}'`)
                    .then(() => resolve('success'))

            })
            .catch(err => reject(err))


    })
}

export { requestPasswordChange, changeForgottenPassword }