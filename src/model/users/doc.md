# get_all_users
returns all users' username, email and id from the database.
no input
output: Array<{id, username, email}>

# create_user
creates a new user.
input: {username, email, password}
output: 'taken' | 'error' | 'success'.
If username and email aren't yet in use the user will be added to the database

# user_login
attempts to log in a user.
input: {username, password} or {email, password}
output:  'not found' | 'not enough data' | 'data error' | 'success' | 'authorization failed'
The function uses custom CryptoMachine to compare given password with hashed password stored in the database.