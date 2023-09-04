# POST /comment
Adds a new comment to the database.  
input as request body: {
    photo_author: string,
    photo_name: string,
    content: string
}
**operation requires authorization.  
**'anonymous' as photo_author means the photo has no owner.  

Limit for comments for every user is one per photo.  

possible outcomes:
    201 - created - successful opperation
    400 - error
    404 - photo not found
    409 - conflict
    422 - wrong input format

# GET /comment/[photo_author]/[photo_name]
Get all the comments of given photo.  
Input given in the url.  
**'anonymous' as photo_author means the photo has no owner.  

possible outcomes:
    200 - comments json: [{id, author, content}]
    400 - error
    422 - wrong input format

# PATCH /comment
Updates the comment.  
input as request body: {
    comment_id: number,
    content: string
}
**requires authorization.  

possible outcomes:
    204 - no content - successful operation
    400 - error
    422 - wrong input format

# DELETE /comment/[comment_id]
Deletes the comment.  
Input given in the url.  
**requires authorization

possible outcomes:
    204 - no content - successful operation
    400 - error
