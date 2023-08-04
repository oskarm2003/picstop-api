# User Controller
User Controller handles the requests that urls' start with '/user'.


# GET /user
Returns all users profiles (no password)

# POST /user/new
Creates new user
input: {username: string, email: string, password: string}