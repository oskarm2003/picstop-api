# parse_request_data
transforms raw request data and transforms it to the JSON.  
Function is asynchronous and it returns a promise  
input: (req: IncomingMessage)  
output: promise\<JSON\>

# crypto_machine
CryptoMachine manages password hashing and comparing  

hash structure: salt$hashed_password  
example: 39dsa$abababa  
    39dsa - salt  
    abababa - hashed password  

.generate_hash(password) - returns concatenated salt and new hashed password ready to be stored in the database  
.match(password, hash_to_compare) - returns true if password matches the hash  
.hash(password, salt) - appends the salt to the given password and returns hashed string  
.create_salt(length) - creates salt with given length. Salt is random string with letters and numbers.  
.get_salt(string) - splits the given hash by '$' and returns only the salt  

# authorization
Authorizise an user by the authorization req header.  
If the authorization failes the function automaticaly sends a server response and returns false.  
You can provide 'who' argument to authorize to a specific user - then the response is a boolean.  
If you omit the 'who' you can either get false, if auth failed, or the name of the user sent in the token.  
input: req, res, who?: string  
output: boolean | string


# color_console
Logs colorful messages and turns them on and off globally.  
You can pass as many arguments of any type as you want.  
ColorConsole will stringify js objects by default, you can change it by setting .object_no_parse to true.  

ColorConsole class object methods:  
.log(text) -> display white text  
.warn(text) -> displays yellow text  
.error(text) -> displays red text (no app stop)  
.notify(text) -> displays blue text  
.success(text) -> display green text  

ColorConsole variables:
.display: boolean -> set to false to omit showing all logs from the object; default: true  
.omit: ['log', 'error', 'warn', 'success', 'notify'] -> the logs in the array will be ommited globally; default: [empty]  
.object_no_stringify: boolean -> set to false to not stringify objects; default: false

# Mailer
Mailer is a class with static methods.  
It is used to send mails with nodemailer.  
Anatomy:
private static templates - used to store and generate mails' templates.  
private static connection - stores the email connection.  
static send.[methods] - used to send a particular email.  