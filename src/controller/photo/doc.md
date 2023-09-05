# Files Controller
controls requests which url's start with /photos


# POST /photo  
Posts new file.  
If an opperation is authorized the photo will have an author.  
If not photo is being posted as the anonymous and is stored in the _shared folder.   
multipart/form-data: {
    file: File,
    name: string
}  
*the name cannot include space or characters: / \ . ,  
*only supported file extensions are: jpg, png, jpeg, tiff

possible outcomes:
201 - created
400 - error
401 - authorization failed
418 - wrong data format or not enough data

# GET /photo/file/[?author]/[file_name]
Sends a photo file by given name.  
Data provided via request url.   
If the photo has an author provide its' name right after the /photo/ string. Omit if there is no author.   
The name of the file should be provided as the last argument.  

possible outcomes:  
200 - success
400 - error
404 - album not found / file not found
418 - wrong data format

# GET /photo/descriptor/[?author]/[?file_name]
Sends a photo JSON description to the client.  
Data provided via request url.   
First provide the author after /photo/descriptor string.  
If you omit an author the _shared files descriptors will be sent.  
If you want only the details about a specific file provide file name after the /[author].  

possible outcomes:
200 - JSON descriptor
400 - error

# DELETE /photo/[author]/[file_name]
Deletes a photo, its' descriptor, it's comments and tags.  
Data provided via request url.   
This action requires authorization via authorization header.  

possible outcomes:
204 - when deleted
400 - error / wrong arguments format
401 - authorization failed

# DELETE /photo
Cleans up all the empty user directories in the uploads.  

outcome:
204 - no content