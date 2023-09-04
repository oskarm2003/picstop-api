import { dbQuery } from "../database/database_model";

//add new comment to the database
function addComment(photo_author: string, photo_name: string, comment_author: string, content: string): Promise<'exists' | 'success' | 'not found'> {

    return new Promise((resolve, reject) => {

        //check if already exsits
        dbQuery(`SELECT count(id) AS result FROM comments WHERE (photo_id=(SELECT id FROM photos WHERE (photos.author='${photo_author}' and photos.name='${photo_name}')) and author='${comment_author}')`)
            .then(data => {
                if (!Array.isArray(data)) { throw new Error('invalid database output') }
                if (data[0].result != 0) {
                    resolve('exists')
                    return
                }

                //add comment
                dbQuery(`INSERT INTO comments (photo_id, author, content) SELECT photos.id, '${comment_author}', '${content}' FROM photos WHERE (photos.author='${photo_author}' and photos.name='${photo_name}')`)
                    .then(data => {

                        //wrong db output
                        if (data === null || typeof data != 'object' || !('affectedRows' in data)) {
                            reject(new Error('invalid database output'))
                            return
                        }

                        //no rows affected
                        if (data.affectedRows === 0) {
                            resolve('not found')
                            return
                        }

                        resolve('success')

                    })

            })
            .catch(err => reject(err))
    })
}

//get all photo comments
type t_comments_output = { id: number, author: string, content: string }
function getComments(photo_author: string, photo_name: string): Promise<Array<t_comments_output>> {

    return new Promise((resolve, reject) => {

        dbQuery(`SELECT comments.id, comments.author, content FROM comments INNER JOIN photos ON photos.id=comments.photo_id WHERE (photos.author='${photo_author}' and photos.name='${photo_name}')`)
            .then(data => {

                if (!Array.isArray(data)) {
                    throw 'wrong database output'
                }

                const output: Array<t_comments_output> = new Array()
                for (let row of data) {
                    output.push(
                        { id: row.id, author: row.author, content: row.content }
                    )
                }
                resolve(output)

            })
            .catch(err => {
                reject(err)
            })
    })
}

//edit comment
function editComment(comment_id: number, comment_author: string, new_content: string): Promise<'not found' | 'success'> {

    return new Promise((resolve, reject) => {

        dbQuery(`UPDATE comments SET content='${new_content}' WHERE (id='${comment_id}' and author='${comment_author}')`)
            .then(data => {
                //wrong db output
                if (data === null || typeof data != 'object' || !('affectedRows' in data)) {
                    reject(new Error('invalid database output'))
                    return
                }

                //no rows affected
                if (data.affectedRows === 0) {
                    resolve('not found')
                    return
                }

                resolve('success')
            })
            .catch(err => reject(err))
    })
}

//delete comment
function deleteComment(comment_id: number, author: string): Promise<void> {

    return new Promise((resolve, reject) => {

        dbQuery(`DELETE FROM comments WHERE (id='${comment_id}' and author='${author}')`)
            .then(() => resolve())
            .catch(err => reject(err))

    })

}

export { addComment, getComments, editComment, deleteComment }