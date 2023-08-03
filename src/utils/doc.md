# parse_request_data
transforms raw request data and transforms it to the JSON.
Function is asynchronous and it returns a promise
input: (req: IncomingMessage)
output: promise<JSON>


# color_console
allows to log colorful logs and turn them on and off globally

ColorConsole class object methods:  
.log(text) -> display white text  
.warn(text) -> displays yellow text  
.error(text) -> displays red text (no app stop)  
.debug(text) -> displays blue text  
.success(text) -> display green text  

ColorConsole variables:
.display: boolean -> false to omit showing all logs from the object  
.omit: ['log','error','warn','success','debug'] -> the logs in the array will be ommited globally