# addComment
input: photo_author: string, photo_name: string, comment_author: string, content: string
output: promise with 'success' or 'exists' or 'not found'

Adds a new comment to the database.  
The function first checks if the comment with provided author and photo_id exists and if so stops the opperation, so any user can comment any photo only once, to avoid spamming.  

# getComments
input: photo_author: string, photo_name: string
output: Array<{id:number, author:string, content:string}>

Returns comments assigned to the given photo from the database.  

# editComment
input: comment_id: number, comment_author: string, new_content: string
output: promise with 'success' or 'not found'

Edits comment's content by the comment id.  
Author is also being validated.  

# deleteComment
input: comment_id: number, author: string
output: promise with a void

Deletes the comment from the database.  
Author is being validated.  