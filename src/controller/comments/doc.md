# Comments Controller
Handles the requests which urls start with /comment.  
Uses model/comments to manage comments data in the database.  

# POST /comment
INPUT
{
    photo_author: string,
    photo_name: string,
    content: string
}

POSSIBLE OUTCOMES:
    201 - created - successful opperation
    400 - error
    404 - photo not found
    409 - conflict
    422 - wrong input format


Adds a new comment to the database.  
Operation requires authorization - 'Bearer [token]' in the authorization header.    
If 'anonymous' set as photo_author it means the photo has no owner.  
Every user can comment each photo only once.  



# GET /comment/[photo_author]/[photo_name]
INPUT in the url: 
    [photo_author] - string
    [photo_name] - string

POSSIBLE OUTCOMES:
    200 - comments json: [{id, author, content}]
    400 - error
    422 - wrong input format


Sends all the comments assigned to the photo_name given in the url.  
if 'anonymous' set as photo_author it means the photo has no owner.  


# PATCH /comment
INPUT
{
    comment_id: number,
    content: string
}

POSSIBLE OUTCOMES:
    204 - success
    400 - error
    401 - unauthorized
    404 - not found
    422 - wrong input format


Updates the comment's content.  
Operation requires authorization - 'Bearer [token]' in the authorization header.    


# DELETE /comment/[comment_id]
INPUT in the url:
    [commend_id] - number

POSSIBLE OUTCOMES:
    204 - success
    400 - error

Deletes the comment with an id given in the url.  
Operation requires authorization - 'Bearer [token]' in the authorization header.    