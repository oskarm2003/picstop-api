import { cc } from "../.."
import { dbQuery } from "../database/database_model"

function createDescriptor(path: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

        let path_arr = path.split('/')

        if (Array.isArray(path_arr) && path_arr.length === 1) {
            path_arr = path_arr[0].split('\\')
        }

        //remove extension from the file name
        let photo_name = path_arr[path_arr.length - 1]
        let extension = '.' + photo_name.split('.').pop()
        photo_name = photo_name.replace(extension, '')

        let album = path_arr[path_arr.length - 2]
        let author = album
        if (album === '_shared') {
            author = 'anonymous'
        }
        let timestamp = Date.now()
        if (album === 'shared') { author = 'unknown' }

        //add the descriptor to the database
        dbQuery(`INSERT INTO photos (name, author, album, timestamp) VALUES ('${photo_name}', '${author}', '${album}', '${timestamp}')`)
            .then(() => {
                resolve(true)
            })
            .catch(err => {
                cc.error('PHOTO DESCRIPTION NOT SAVED IN THE DB:', err)
                reject(err)
            })
    })
}

//get descriptor from the database
type t_descriptor = { id: number, name: string, author: string, album: string, timestamp: number }
function readDescriptor(album: string, name?: string): Promise<Array<t_descriptor> | t_descriptor> {

    return new Promise((resolve, reject) => {

        if (name === undefined) {
            dbQuery(`SELECT * FROM photos WHERE (album='${album}')`)
                .catch(err => {
                    cc.error('DESCRIPTOR NOT FOUND: ', err)
                    reject(err)
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const output: Array<t_descriptor> = new Array()
                        for (let row of data) {
                            output.push({
                                id: row.id,
                                name: row.name,
                                author: row.author,
                                album: row.album,
                                timestamp: row.timestamp
                            })
                        }
                        resolve(output)
                    }
                    else {
                        reject('wrong output format')
                    }
                })
            return
        }
        else {
            dbQuery(`SELECT * FROM photos WHERE (album='${album}' AND name='${name}')`)
                .then(data => {
                    if (Array.isArray(data) && data.length > 0) {
                        resolve({
                            id: data[0].id,
                            name: data[0].name,
                            author: data[0].author,
                            album: data[0].album,
                            timestamp: data[0].timestamp
                        })
                    }
                    else {
                        reject('descriptor not found')
                    }
                })
                .catch(err => {
                    cc.error('DESCRIPTOR NOT FOUND: ', err)
                    reject(err)
                })
            return
        }
    })
}

function deleteDescriptor(album: string, name: string): Promise<true> {

    return new Promise((resolve, reject) => {

        dbQuery(`DELETE FROM photos WHERE (album='${album}' AND name='${name}')`)
            .then(() => resolve(true))
            .catch(err => reject(err))

    })

}

export { createDescriptor, readDescriptor, deleteDescriptor }