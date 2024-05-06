import { dbQuery } from "../database/database_model"

type t_photo_data = { id: number, name: string, author: string, album: string, timestamp: number }

//get descriptors that match the author
export function searchByAuthor(author: string): Promise<Array<t_photo_data>> {
    return new Promise((resolve, reject) => {

        dbQuery(`SELECT * FROM photos WHERE (author='${author}')`)
            .then(data => {
                if (!Array.isArray(data)) throw 'invalid database response'

                const output: Array<t_photo_data> = new Array()
                for (let row of data) {
                    output.push(
                        {
                            id: row.id,
                            name: row.name,
                            author: row.author,
                            album: row.album,
                            timestamp: row.timestamp
                        }
                    )
                }
                resolve(output)

            })
            .catch(err => reject(err))
    })
}

//get descriptors that match the name
export function searchByName(name: string): Promise<Array<t_photo_data>> {
    return new Promise((resolve, reject) => {

        dbQuery(`SELECT * FROM photos WHERE (name='${name}')`)
            .then(data => {
                if (!Array.isArray(data)) throw 'invalid database response'

                const output: Array<t_photo_data> = new Array()
                for (let row of data) {
                    output.push(
                        {
                            id: row.id,
                            name: row.name,
                            author: row.author,
                            album: row.album,
                            timestamp: row.timestamp
                        }
                    )
                }
                resolve(output)

            })
            .catch(err => reject(err))
    })
}

//get descriptors by tag
export function searchByTag(tag: string): Promise<Array<t_photo_data>> {
    return new Promise((resolve, reject) => {

        dbQuery('SELECT * FROM photos ')
        //TODO: finish
    })
}


//get photos by the [n]th id from [origin]. The cuantity is limited by [limit]
export function getEveryNthId(origin: number, n: number, limit: number = 30): Promise<Array<t_photo_data>> {

    return new Promise((resolve, reject) => {


        const query = `SELECT * FROM photos WHERE ((id - ${origin}) % ${n} = 0 and id>=${origin}) LIMIT ${limit}`
        dbQuery(query)
            .then(data => {
                if (!Array.isArray(data)) throw 'Invalid database response'
                const output: Array<t_photo_data> = []
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
            })
            .catch(err => reject(err))

    })
}