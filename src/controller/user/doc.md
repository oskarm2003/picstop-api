# User Controller
User Controller handles the requests that urls' start with '/user'.


# GET /user
Returns all users profiles (no password)

# POST /user/new
Creates new user   
input: {username, email, password}  
**forbidden usernames: anonymous, _shared

max length of the inputs:  
username - 30 characters  
email - 320 characters  
password - 50 characters  

possible outcomes are:  
201 - 'created'  
400 - 'error'  
409 - 'already in use'  
418 - 'wrong data format'  


# POST /user/login  
Logs in a user  
input: {username, password} or {email, password}  

possible outcomes are:  
200 - token  
401 - 'authentication failed'  
418 - 'wrong data format'  

# POST /user/prepare_verification
Encodes the given email and sends the account verification email to it.  
If the account with given email does not exist the application sends an error.  
input: {email: string}  
possible outcomes:
204 - 'no content' - success
400 - error

# GET /user/verify/[token]
Verifies the email by the token given in the url.  
If succeeds the server responds with the html with the success message.  
possible outcomes:
200 - html - success
400 - error

# POST /user/change_password/request
Checks if given email is registered in the database, then generates token with that email and sends the password change form link to that email address. Link for password change includes the token that is active for 5 minutes.  
input: {email: string}
possible outcomes:
204 - no content - success
400 - error

# PATCH /user/change_password/forgotten
Changes the forgotten password. User is verified by the token with email.  
input: {token: tokenized{email:string}, password: string}
possible outcomes:
204 - no content - success
400 - error
498 - token expired