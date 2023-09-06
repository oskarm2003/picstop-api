# User Controller
User Controller handles the requests that urls' start with '/user'.  
Uses model/user to manage users' data in the database.  


# GET /user
NO INPUT

POSSIBLE OUTCOMES:  
    200 - user data {id, username, email}
    400 -error

Returns all users profiles (no password)

# POST /user/new
INPUT: 
{
    username: string
    email: string
    password: string
}

max length of the inputs:  
    username - 30 characters  
    email - 320 characters  
    password - 50 characters  

POSSIBLE OUTCOMES are:  
    201 - created  
    400 - error  
    409 - already in use  
    418 - wrong data format  

Creates new user   
Forbidden usernames: anonymous, _shared


# POST /user/login  
input: {username, password} or {email, password}  

POSSIBLE OUTCOMES are:  
    200 - token   
    401 - authentication failed   
    418 - wrong data format   

Attempts to log in the user.    

# POST /user/prepare_verification
INPUT: 
{
    email: string
}  

POSSIBLE OUTCOMES:  
    204 - success   
    400 - error   
    404 - not found  


Encodes the given email and sends the account verification email to its' address.  
If the account with given email does not exist the application sends an error.  

# GET /user/verify/[token]
INPUT in the url
    [token] - string - tokenized {email:string} 

POSSIBLE OUTCOMES:  
    200 - html - success  
    400 - error

Verifies user's email by the token given in the url.  
If succeeds the server responds with the html with the success message.  

# POST /user/change_password/request
INPUT: 
{
    email: string
}

POSSIBLE OUTCOMES:  
    204 - no content - success  
    400 - error


Checks if given email is registered in the database, then generates token with that email and sends the password change form link to that email address. Link for password change includes the token that is active for 5 minutes.  

# PATCH /user/change_password/forgotten
INPUT: 
{
    token: tokenized{email:string}
    password: string
}

POSSIBLE OUTCOMES:  
204 - no content - success  
400 - error  
498 - token expired  


Changes the forgotten password. User is verified by the token with email.  
