import * as mysql from 'mysql'
import { cc } from '../..'

//create new db
async function createDB(name: string) {

    const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '' })
    connection.connect()
    connection.query('CREATE DATABASE IF NOT EXISTS ' + name + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_bin', (err) => {
        if (err) {
            cc.error('CREATE DB ERROR: ', err)
            return false
        }
    })
    connection.query('USE ' + name)
    connection.query('CREATE TABLE IF NOT EXISTS `users` (`id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(30) NOT NULL , `email` VARCHAR(320) NOT NULL , `password` VARCHAR(150) NOT NULL , PRIMARY KEY (`id`), CONSTRAINT unique_value UNIQUE (username, email));')
    connection.query('CREATE TABLE IF NOT EXISTS photos (id INT NOT NULL AUTO_INCREMENT , name VARCHAR(64) NOT NULL , author VARCHAR(30) NOT NULL , album VARCHAR(30) NOT NULL , timestamp INT(20) NOT NULL , PRIMARY KEY (`id`));')
    connection.query('CREATE TABLE IF NOT EXISTS tags (photo_id INT(16) NOT NULL , tag_name VARCHAR(64) NOT NULL ); ')
    connection.query('CREATE TABLE comments (id INT(11) NOT NULL AUTO_INCREMENT , photo_id INT(11) NOT NULL , author VARCHAR(30) NOT NULL , content VARCHAR(256) NOT NULL , PRIMARY KEY (`id`)) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;')
    connection.end()
    return true
}

async function removeDB(name: string) {

    const connection = mysql.createConnection({ host: 'localhost', user: 'root', password: '' })
    connection.query('DROP DATABASE ' + name)
    connection.end()

}

//connects to database and runs a query provided in the input
async function dbQuery(query: string) {

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

export { dbQuery, createDB, removeDB }