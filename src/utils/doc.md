# parse_request_data
transforms raw request data and transforms it to the JSON.
Function is asynchronous and it returns a promise
input: (req: IncomingMessage)
output: promise\<JSON\>


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