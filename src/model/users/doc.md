# get_all_users
returns all users' username, email and id from the database
no input
output: Array<{id, username, email}>

# create_user
creates new user.
input: {username, email, password}
output: boolean.
True if user created successfully
False if user already exists or other problem occured
