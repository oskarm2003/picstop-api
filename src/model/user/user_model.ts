import * as jwt from 'jsonwebtoken'
import { cc } from "../../index"
import CryptoMachine from "../../utils/crypto_machine"
import { dbQuery } from "../database/database_model"
import { IncomingMessage } from 'http'
require('dotenv').config()

interface t_user { username: string, email: string, password?: string, id?: number }


//get all users' data from the database
async function getAllUsers(): Promise<Array<t_user>> {

    let output: Array<t_user> = []
    const result = await dbQuery('SELECT * FROM users')
        //on error    
        .catch(err => cc.error('GET ALL USERS ERROR: ', err))

    //if not an array or empty
    if (!Array.isArray(result) || result.length === 0) return []

    //if valid array
    for (let row of result) {
        output.push({
            id: row.id,
            username: row.username,
            email: row.email
        })
    }

    return output

}

//get user data
async function getUserData(user: string | number): Promise<t_user> {

    return new Promise((resolve, reject) => {

        dbQuery(`SELECT id,username,email FROM users WHERE (id='${user}' or username='${user}' or email='${user}')`)
            .then(response => {
                if (!Array.isArray(response) || typeof response[0] != 'object') {
                    throw 'invalid database output'
                }

                resolve({
                    id: response[0].id,
                    username: response[0].username,
                    email: response[0].email
                })
            })
            .catch(err => reject(err))

    })

}

//create new user in the database
type t_reg_output = 'taken' | 'error' | 'success' | 'wrong data format'

async function createUser({ username, email, password }:
    { username: string, email: string, password: string }): Promise<t_reg_output> {

    //hash a password
    let hashed_password = CryptoMachine.generate_hash(password)

    return new Promise((resolve, reject) => {

        //reserved keyword
        if (username === '_shared') {
            resolve('taken')
            return
        }

        //wrong format
        if (username.includes('/') || username.includes('\\')) {
            resolve('wrong data format')
            return
        }

        //check if username or email in use
        dbQuery(`SELECT * FROM users WHERE (username='${username}' or email='${email}')`)
            .then(data => {
                //if taken
                if (Array.isArray(data) && data.length != 0) {
                    resolve('taken')
                    return
                }

                //proceed
                dbQuery(`INSERT INTO users (username, email, password, update_timestamp) VALUES ('${username}','${email}','${hashed_password}', '${Date.now()}')`)
                    .then(() => resolve('success'))
            })
            //error handling
            .catch(err => {
                //error handling
                if (err.code === 'ER_DUP_ENTRY') {
                    resolve('taken')
                    return
                }
                else {
                    cc.error('CREATE USER ERROR: ', err)
                    resolve('error')
                    return
                }
            })

    })
}

//login a user
type t_auth_output = 'not found' | 'not enough data' | 'success' | 'authentication failed'

async function userLogin({ password, username, email }:
    { username?: string, email?: string, password: string }): Promise<t_auth_output> {

    return new Promise(async (resolve) => {

        let result
        if (email != undefined) {
            result = await dbQuery(`SELECT password FROM users WHERE email='${email}'`)
                //error handling
                .catch(err => {
                    cc.error('USER LOGIN ERROR: ', err);
                    resolve('not found')
                })
        }
        else if (username != undefined) {
            result = await dbQuery(`SELECT password FROM users WHERE username='${username}'`)
                //error handling
                .catch(err => {
                    cc.error('USER LOGIN ERROR: ', err);
                    resolve('not found')
                })
        }
        else {
            resolve('not enough data')
        }

        //if wrong data type
        if (!Array.isArray(result) || typeof result[0] != 'object') return resolve('not found')

        //compare
        const hash = result[0].password
        if (CryptoMachine.match(password, hash)) {
            resolve('success')
            return
        }
        resolve('authentication failed')

    })
}

//generates new token for given user
function generateToken(username: string) {

    const token_key = process.env.TOKEN_KEY
    if (typeof token_key != 'string') {
        return false
    }

    return jwt.sign({ username: username }, token_key, { expiresIn: '1h' })

}

//authorize the user
function authorizeUser(req: IncomingMessage): false | string {

    //check if valid token format
    if (req.headers.authorization === undefined || !req.headers.authorization.startsWith('Bearer ')) return false
    const token = req.headers.authorization.replace('Bearer ', '')

    //verify
    let decoded
    try {
        const token_key = process.env.TOKEN_KEY
        if (typeof token_key != 'string') {
            return false
        }
        decoded = jwt.verify(token, token_key)
    } catch (err) {
        if (err instanceof Error && err.message === 'invalid signature') cc.warn('INVALID TOKEN SIGNTURE')
        else cc.log(err)
        return false
    }

    if (typeof decoded != 'object' || decoded.username === undefined) return false

    return decoded.username

}

function deleteUser(username: string): Promise<void> {

    return new Promise((resolve, reject) => {

        //remove user
        dbQuery(`DELETE FROM users WHERE (username='${username}')`)
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

export { getAllUsers, createUser, userLogin, generateToken, getUserData, authorizeUser, deleteUser }
export type { t_user }