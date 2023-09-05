import { dbQuery } from "../database/database_model";

//counts how many times does the tag occur
function countTag(name: string): Promise<number> {

    return new Promise((resolve, reject) => {
        dbQuery(`SELECT COUNT(tag_name) AS 'quantity' FROM tags WHERE (tag_name='${name}') GROUP BY tag_name`)
            .then(data => {

                if (!Array.isArray(data)) {
                    reject('wrong output format')
                    return
                }

                if (data.length === 0) {
                    reject(`tag ${name} could not be found`)
                    return
                }
                resolve(data[0].quantity)
            })
            .catch(err => reject(err))
    })
}

//returns all tags
type t_tag = { name: string, popularity: number }
function allTags(): Promise<Array<t_tag>> {

    return new Promise((resolve, reject) => {
        dbQuery('SELECT tag_name, COUNT(tag_name) as popularity FROM tags GROUP BY tag_name ORDER BY popularity DESC')
            .then(data => {

                if (!Array.isArray(data)) {
                    reject('wrong data format')
                    return
                }

                const output: Array<t_tag> = new Array()
                for (let row of data) {
                    output.push({
                        name: row.tag_name,
                        popularity: row.popularity
                    })
                }
                resolve(output)
            })
            .catch(err => reject(err))
    })
}

//adds a new tag to a photo if not added already
function addTag(tag_name: string, photo_author: string, photo_name: string): Promise<void> {

    return new Promise((resolve, reject) => {
        dbQuery(`SELECT * FROM tags WHERE (tag_name='${tag_name}' and photo_id=(SELECT id FROM photos WHERE (name='${photo_name}' and author='${photo_author}')))`)
            .then(data => {
                //if tag already exists
                if (!Array.isArray(data) || data.length != 0) {
                    reject('tag already exists in this photo')
                    return
                }

                //add a new tag
                return dbQuery(`INSERT INTO tags SELECT id, '${tag_name}' FROM photos WHERE (name='${photo_name}' and author='${photo_author}')`)
                    .then(() => { resolve() })

            })
            .catch(err => {
                reject(err)
            })
    })
}

//remove tag from the photo
function removeTagFromPhoto(tag_name: string, photo_author: string, photo_name: string): Promise<true> {

    return new Promise((resolve, reject) => {

        dbQuery(`DELETE FROM tags WHERE (tag_name='${tag_name}' and photo_id=(SELECT id FROM photos WHERE (author='${photo_author}' and name='${photo_name}')))`)
            .then(() => resolve(true))
            .catch(err => reject(err))
    })
}

//return all tags assigned to a photo
function getPhotoTags(photo_name: string, photo_author: string): Promise<Array<string>> {

    return new Promise((resolve, reject) => {

        dbQuery(`SELECT tag_name FROM tags WHERE (photo_id=(SELECT id FROM photos WHERE (author='${photo_author}' and name='${photo_name}')))`)
            .then(data => {

                if (!Array.isArray(data)) {
                    reject('wrong output format')
                    return
                }

                const output: Array<string> = new Array()
                for (let row of data) {
                    output.push(row.tag_name)
                }
                resolve(output)
            })
    })
}

//deletes all photo's tags
function removeAllTags(author: string, photo_name: string) {

    return new Promise((resolve, reject) => {

        dbQuery(`DELETE FROM tags WHERE (photo_id=(SELECT id FROM photos WHERE (author='${author}' and name='${photo_name}')))`)
            .then(() => resolve(true))
            .catch(err => reject(err))

    })

}

//return all photos' names assigned to the tag
type t_tagged = { name: string, album: string }
function getTagged(tag_name: string): Promise<Array<t_tagged>> {

    return new Promise((resolve, reject) => {

        dbQuery(`SELECT photos.name, photos.album FROM tags INNER JOIN photos ON photos.id=photo_id WHERE (tag_name='${tag_name}')`)
            .then(data => {
                if (!Array.isArray(data)) {
                    throw 'invalid database response'
                }

                //format received data
                const output: Array<t_tagged> = new Array()
                for (let el of data) {
                    output.push({
                        name: el.name,
                        album: el.album
                    })
                }


                resolve(output)
            })
            .catch(err => reject(err))

    })
}

export { countTag, allTags, addTag, removeTagFromPhoto, removeAllTags, getPhotoTags, getTagged }