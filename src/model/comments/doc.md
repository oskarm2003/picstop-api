# addComment
Adds a new comment to the database.  
The function first checks if the comment with provided author and photo_id exists and if so stops the opperation, so any user can comment any photo only once, to avoid spamming.  
input: photo_author: string, photo_name: string, comment_author: string, content: string
output: promise with 'success' or 'exists' or 'not found'

# getComments
Returns comments assigned to the given photo from the database.  
input: photo_author: string, photo_name: string
output: Array<{id:number, author:string, content:string}>

# editComment
Edits comment's content by the comment id.  
Author is also being validated.  
input: comment_id: number, comment_author: string, new_content: string
output: promise with 'success' or 'not found'

# deleteComment
Deletes the comment from the database.  
Author is being validated.  
input: comment_id: number, author: string
output: promise with a void