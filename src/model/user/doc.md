# get_all_users
returns all users' username, email and id from the database.
no input
output: Array<{id, username, email}>

# get_user_data
returns one user's username, email and id from the database.
input: email | username | id
output {id,username,email}

# create_user
creates a new user.
input: {username, email, password}  
*username cannot include '/' or '\'
output: 'taken' | 'error' | 'success'.
If username and email aren't yet in use the user will be added to the database

# user_login
attempts to log in a user.
input: {username, password} or {email, password}
output:  'not found' | 'not enough data' | 'data error' | 'success' | 'authentication failed'
The function uses custom CryptoMachine to compare given password with hashed password stored in the database.

# generate_token
generates new token with encrypted username.
token expires in 1 hour.
input: username
output: token

# authorize_user
authorizes the user by given token.  
after decoding the token checks if it is valid
input: token
output: false | username