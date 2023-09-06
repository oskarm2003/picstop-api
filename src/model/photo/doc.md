# file_model file:

# post_image
input: req: incomingMessage, author: string  
output: {code: number, ok: true, path: string} or {code: number, ok: false, message: string}  

Parses given req and creates an image according to it.  
The image is being scaled down and moved to the assigned album.  
Once the file is posted its' description is created and sent to the database.   

# get_image
input: name: string, album: string  
output: {code: number, ok: false, message: string} or {code: number, ok: true, file: Buffer}

Searches for the photo, reads it and returns.  

# scale_down
input: path: string  
output: promise with a boolean  

Scales the image down using 'sharp'.  

# create_album
input: name: string
output: promise with a boolean   

Creates new album.  

# remove_asset
input: path: string
output: promise with a boolean  

Removes file or directory.  

# cleanUp
input: name:? string
output: promise with true

Cleans up by removing empty albums in the uploads directory.  
The _shared album is being skipped.  
If no arguments are given the function will look for all the empty directories.  
If name given only the specified directory is being checked.  


# descriptor_model file:

# createDescriptor
input: path: string
output: promise with a boolean

Creates new photo descriptor in a json format.  
By given path function generates photo name, album name, author name and creation date.  

# readDescriptor
input: album: string, name?: string 
output: promise with the JSON data

Finds and returns the desired files' descriptors.  

# deleteDescriptor
input: album: stirng, name: string
output: promise

Deletes the descriptor.  

# deleteDescriptorsByAuthor
input: author: string  
output: void promise

Deletes all the descriptors of the photo by given author.  