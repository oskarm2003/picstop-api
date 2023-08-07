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

async function create_user({ username, email, password }: { username: string, email: string, password: string }): Promise<'taken' | 'error' | 'success'> {

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

export { get_all_users, create_user }
export type { t_user }