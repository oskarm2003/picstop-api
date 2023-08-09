import * as jwt from 'jsonwebtoken'
import { cc } from "../../index"
import CryptoMachine from "../../utils/crypto_machine"
import { db_query } from "../database/database_model"
interface t_user { username: string, email: string, password?: string, id?: number }


//get all users' data from the database
async function get_all_users(): Promise<Array<t_user>> {

    let output: Array<t_user> = []
    const result = await db_query('SELECT * FROM users')
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
async function get_user_data({ username, email, id }: { username?: string, email?: string, id?: number }): Promise<t_user | null> {

    return new Promise(async (resolve) => {

        let response
        if (username != undefined) {
            response = await db_query(`SELECT id,username,email FROM users WHERE username='${username}'`)
        }
        else if (email != undefined) {
            response = await db_query(`SELECT id,username,email FROM users WHERE email='${email}'`)
        }
        else if (id != undefined) {
            response = await db_query(`SELECT id,username,email FROM users WHERE id='${id}'`)
        }
        else {
            resolve(null)
            return
        }

        if (!Array.isArray(response) || typeof response[0] != 'object') {
            resolve(null)
            return
        }

        resolve({
            id: response[0].id,
            username: response[0].username,
            email: response[0].email
        })
    })

}

//create new user in the database
type t_reg_output = 'taken' | 'error' | 'success'

async function create_user({ username, email, password }:
    { username: string, email: string, password: string }): Promise<t_reg_output> {

    //hash a password with bcrypt
    let hashed_password = CryptoMachine.generate_hash(password)

    return new Promise((resolve) => {

        db_query(`INSERT INTO users (username, email, password) VALUES ('${username}','${email}','${hashed_password}')`)
            .then(() => resolve('success'))
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

async function user_login({ password, username, email }:
    { username?: string, email?: string, password: string }): Promise<t_auth_output> {

    return new Promise(async (resolve) => {

        let result
        if (email != undefined) {
            result = await db_query(`SELECT password FROM users WHERE email='${email}'`)
                //error handling
                .catch(err => {
                    cc.error('USER LOGIN ERROR: ', err);
                    resolve('not found')
                })
        }
        else if (username != undefined) {
            result = await db_query(`SELECT password FROM users WHERE username='${username}'`)
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
function generate_token(username: string) {
    return jwt.sign({ username: username }, 'secret key', { expiresIn: '1h' })
}

export { get_all_users, create_user, user_login, generate_token, get_user_data }
export type { t_user }