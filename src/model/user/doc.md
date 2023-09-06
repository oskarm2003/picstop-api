# get_all_users
returns all users' username, email and id from the database.
no input
output: Array<{id, username, email}>

# get_user_data
input: email | username | id
output {id,username,email}

returns one user's username, email and id from the database.

# create_user
input: {username, email, password}  
*username cannot include '/' or '\'
output: 'taken' | 'error' | 'success'.

Creates a new user.
If username and email aren't yet in use the user will be added to the database

# user_login
input: {username, password} or {email, password}
output:  'not found' | 'not enough data' | 'data error' | 'success' | 'authentication failed'

Attempts to log in a user.
The function uses custom CryptoMachine to compare given password with hashed password stored in the database.

# generate_token
input: username
output: token

generates new token with encrypted username.
token expires in 1 hour.

# authorize_user
input: token
output: false | username

authorizes the user by given token.  
after decoding the token checks if it is valid

# prepareVerification
input: email: string
output: token with {email: string}

Encodes the given email to the token and sends the verification message to the given email address.  

# verifyEmail
input: token: string
output: void promise

Verifies email given in the token by updating the 'verified' db record.  

# requestPasswordChange
input: email: string
output: void promise

Checks if the email is verified and if so, sends the password change form link to the given email address.  
The password change form link contains token with {email: string} that was previously signed with private token key.  

# changeForgottenPassword
input: {token: string, password: string}
output: promise with 'success' or 'expired'

Decodes the given token and changes the password of the user with email encrypted in the token.  

# deleteUser
input: username: string
output: void promise

Deletes the user from the database.  