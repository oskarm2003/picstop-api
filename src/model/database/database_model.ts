import * as mysql from 'mysql2'
import { cc } from '../..'

//create new db
async function createDB(name: string) {

    const connection = mysql.createConnection({ host: process.env.DB_HOSTNAME, user: process.env.DB_USERNAME, password: process.env.DB_PASSWD, charset: 'utf8mb4' })
    connection.connect(err => {
        if (err) {
            cc.error("Connection Error:", err);
            throw new Error("db conn error")
        }
    })
    connection.query('CREATE DATABASE IF NOT EXISTS ' + name + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', (err) => {
        if (err) {
            cc.error('CREATE DB Error: ', err)
            return false
        }
    })
    connection.query('USE ' + name)
    connection.query('CREATE TABLE IF NOT EXISTS `users` (`id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(30) NOT NULL , `email` VARCHAR(320) NOT NULL , `password` VARCHAR(150) NOT NULL,`verified` BOOLEAN NOT NULL, `update_timestamp` BIGINT(20) NOT NULL , PRIMARY KEY (`id`), CONSTRAINT unique_value UNIQUE (username, email));')
    connection.query('CREATE TABLE IF NOT EXISTS photos (id INT NOT NULL AUTO_INCREMENT , name VARCHAR(64) NOT NULL , author VARCHAR(30) NOT NULL , album VARCHAR(30) NOT NULL , timestamp BIGINT(20) NOT NULL , PRIMARY KEY (`id`));')
    connection.query('CREATE TABLE IF NOT EXISTS tags (photo_id INT(16) NOT NULL , tag_name VARCHAR(64) NOT NULL ); ')
    connection.query('CREATE TABLE IF NOT EXISTS comments (id INT(11) NOT NULL AUTO_INCREMENT , photo_id INT(11) NOT NULL , author VARCHAR(30) NOT NULL , content VARCHAR(256) NOT NULL , PRIMARY KEY (`id`)) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;')
    connection.end()
    return true
}

async function removeDB(name: string) {

    const connection = mysql.createConnection({ host: process.env.DB_HOSTNAME, user: 'root', password: process.env.DB_PASSWD })
    connection.query('DROP DATABASE ' + name)
    connection.end()

}

type t_connection = { connection: mysql.Connection, active_processes: number }
const connection_pool: Array<t_connection> = []

//connects to database and runs a query provided in the input
async function dbQuery(query: string) {

    return new Promise((resolve, reject) => {

        // connection pool empty
        if (connection_pool.length === 0) {
            const connection = mysql.createConnection({ host: process.env.DB_HOSTNAME, user: 'root', password: process.env.DB_PASSWD, database: db_name, charset: 'utf8mb4' })
            connection.connect((err) => {
                if (err) {
                    cc.error(err)
                    reject('DB no connection')
                }
                connection_pool.push({ active_processes: 0, connection: connection })
                callDB(query)
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        }
        //connection found
        else {
            callDB(query)
                .then(data => resolve(data))
                .catch(err => reject(err))
        }

    })
}

async function callDB(query: string) {

    connection_pool[0].active_processes++

    return new Promise((resolve, reject) => {
        connection_pool[0].connection.query(query, (err, result) => {

            connection_pool[0].active_processes--

            if (connection_pool[0].active_processes === 0) {
                connection_pool[0].connection.destroy()
                connection_pool[0] = connection_pool[connection_pool.length - 1]
                connection_pool.pop()
            }

            if (err) reject(err)
            resolve(result)
        })
    })

}

export { dbQuery, createDB, removeDB }