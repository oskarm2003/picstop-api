# file_model file:

# post_image
Parses given req and creates an image according to it.  
The image is being scaled down and moved to the assigned album.  
Once the file is posted its' description is created and sent to the database.   
input: req: incomingMessage, author: string  
output: {code: number, ok: true, path: string} or {code: number, ok: false, message: string}  

# get_image
Searches for the photo, reads it and returns.  
input: name: string, album: string  
output: {code: number, ok: false, message: string} or {code: number, ok: true, file: Buffer}

# scale_down
Scales the image down using 'sharp'.  
input: path: string  
output: promise with a boolean  

# create_album
Creates new album.  
input: name: string
output: promise with a boolean   

# remove_asset
Removes file or directory.  
input: path: string
output: promise with a boolean  



# descriptor_model file:

# createDescriptor
Creates new photo descriptor in a json format.  
By given path function generates photo name, album name, author name and creation date.  
input: path: string
output: promise with a boolean

# readDescriptor
Finds and returns the desired files' descriptors.  
input: album: string, name?: string 
output: promise with the JSON data

# deleteDescriptor
Deletes the descriptor.  
input: album: stirng, name: string
output: promise