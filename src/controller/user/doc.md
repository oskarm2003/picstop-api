# User Controller
User Controller handles the requests that urls' start with '/user'.


# GET /user
Returns all users profiles (no password)

# POST /user/new
Creates new user   
input: {username, email, password}  

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