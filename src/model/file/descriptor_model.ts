import { cc } from "../.."
import { db_query } from "../database/database_model"

async function createDecriptor(path: string): Promise<boolean> {

    return new Promise((resolve) => {

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
        if (album === 'shared') { author = 'unknown' }

        //add the descriptor to the database
        db_query(`INSERT INTO photos (name, author, album) VALUES ('${photo_name}', '${author}', '${album}')`)
            .catch(err => {
                cc.error('PHOTO DESCRIPTION NOT SAVED IN THE DB:', err)
                resolve(false)
            })
            .then(() => {
                resolve(true)
            })
    })

}

export { createDecriptor }