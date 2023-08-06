import * as mysql from 'mysql'
import { cc } from '../..'

let database = 'photos_db'
const change_db = (name: string) => { database = name }

//create new db
async function create_db(name: string) {

    const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '' })
    connection.connect()
    connection.query('CREATE DATABASE ' + name, (err) => {
        if (err) {
            cc.error('CREATE DB ERROR: ', err)
            return false
        }
    })
    connection.query('USE ' + name)
    //TODO: finish - create tables with unique email and username keys

}

//connects to database and runs a query provided in the input
async function db_query(query: string) {

    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: database })
        connection.connect((err) => {
            //on db error
            if (err) {
                reject('database no connection')
            }
            connection.query(query, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    })
}

export { db_query, change_db }