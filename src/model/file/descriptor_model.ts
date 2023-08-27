import { cc } from "../.."
import { db_query } from "../database/database_model"

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
        let timestamp = Date.now()
        if (album === 'shared') { author = 'unknown' }

        //add the descriptor to the database
        db_query(`INSERT INTO photos (name, author, album, timestamp) VALUES ('${photo_name}', '${author}', '${album}', '${timestamp}')`)
            .catch(err => {
                cc.error('PHOTO DESCRIPTION NOT SAVED IN THE DB:', err)
                reject(err)
            })
            .then(() => {
                resolve(true)
            })
    })
}

//get descriptor from the database
function readDescriptor(album: string, name: string | undefined) {

    return new Promise((resolve, reject) => {

        if (name === undefined) {
            db_query(`SELECT * FROM photos WHERE (album='${album}')`)
                .catch(err => {
                    cc.error('DESCRIPTOR NOT FOUND: ', err)
                    reject(err)
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const output = new Array()
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
            db_query(`SELECT * FROM photos WHERE (album='${album}' AND name='${name}')`)
                .catch(err => {
                    cc.error('DESCRIPTOR NOT FOUND: ', err)
                    reject(err)
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        resolve({
                            id: data[0].id,
                            name: data[0].name,
                            author: data[0].author,
                            album: data[0].album,
                            timestamp: data[0].timestamp
                        })
                    }
                    else {
                        reject('wrong output format')
                    }
                })
            return
        }
    })
}

function deleteDescriptor(album: string, name: string): Promise<true> {

    return new Promise((resolve, reject) => {

        db_query(`DELETE FROM photos WHERE (album='${album}' AND name='${name}')`)
            .catch(err => reject(err))
            .then(() => resolve(true))

    })

}

export { createDescriptor, readDescriptor, deleteDescriptor }