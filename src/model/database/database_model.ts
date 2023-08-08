import * as mysql from 'mysql'
import { cc } from '../..'

//global db name
declare global {
    var db_name: string
}

global.db_name = 'photos_db'


//create new db
async function create_db(name: string) {

    const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '' })
    connection.connect()
    connection.query('CREATE DATABASE IF NOT EXISTS ' + name, (err) => {
        if (err) {
            cc.error('CREATE DB ERROR: ', err)
            return false
        }
    })
    connection.query('USE ' + name)
    connection.query('CREATE TABLE IF NOT EXISTS `users` (`id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(30) NOT NULL , `email` VARCHAR(320) NOT NULL , `password` VARCHAR(150) NOT NULL , PRIMARY KEY (`id`), CONSTRAINT unique_value UNIQUE (username, email));')
    connection.end()
    return true
}

async function remove_db(name: string) {

    const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '' })
    connection.query('DROP DATABASE ' + name)
    connection.end()

}

//connects to database and runs a query provided in the input
async function db_query(query: string) {

    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: db_name })
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

export { db_query, create_db, remove_db }