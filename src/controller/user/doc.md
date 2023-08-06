# User Controller
User Controller handles the requests that urls' start with '/user'.


# GET /user
Returns all users profiles (no password)

# POST /user/new
Creates new user
input: {username: string, email: string, password: string}

max length of the inputs:
username - 30 characters
email - 320 characters
password - 50 characters