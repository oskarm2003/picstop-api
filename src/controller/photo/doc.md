# Files Controller
Controls requests which url's start with /photos.  
Uses model/photo to manage the files saved in the uploads directory and their descriptors in the database.  


# POST /photo  
 INPUT as multipart/formdata:  
{  
    file: File,  
    name: string  
}    
 
POSSIBLE OUTCOMES:  
    201 - created  
    400 - error  
    401 - authorization failed  
    418 - wrong data format or not enough data  


Posts a new photo - adds the posted file to the particular album in the uploads directory and adds a descriptor to the database.  
The name cannot include space or characters: / \ . ,  
Only supported file extensions are: jpg, png, jpeg, tiff  
If an opperation is authorized the photo will be stored in the author's personal album in the uploads directory.  
If opperation is not authorized the photo will be posted with the anonymous author and will be stored in the _shared folder.  
Authorize with 'Bearer [token]' in the authorization header.  

# GET /photo/file/[?author]/[file_name]
INPUT in the url
    [?author] - string, can be omitted
    [file_name] - string

POSSIBLE OUTCOMES:  
    200 - success
    400 - error
    404 - album not found / file not found
    418 - wrong data format


Sends a photo file with given name.  
If author set to anonymous the _shared folder will be searched.  
The name of the file should be provided as the last argument.  


# GET /photo/descriptor/[?author]/[?file_name]
INPUT in the url
    [?author] - string, can be omitted
    [?file_name] - string, can be omitted

POSSIBLE OUTCOMES:  
    200 - JSON descriptor  
    400 - error  


Sends a photo description in the JSON format.  
First provide the author after /photo/descriptor string.  
If author is set to 'anonymous' the _shared files descriptors will be sent.  
If you want only the details about a specific file provide file name after the /[author].  


# GET /photo/descriptor/random/[number]
INPUT in the url  
    [number] - number - how many descriptors to return

POSSIBLE OUTCOMES  
    200 - descriptor JSON
    400 - error

Returns [number] random photo descriptors


# DELETE /photo/[author]/[file_name]
INPUT is the url:  
    [author] - string  
    [file_name] - string  

POSSIBLE OUTCOMES:  
    204 - when deleted  
    400 - error / wrong arguments format  
    401 - authorization failed  

Deletes the file and corresponding data (descriptor, tags and comments).  
Operation requires authorization - 'Bearer [token]' in the authorization header.    

# DELETE /photo
NO INPUT  

OUTCOME:  
    204 - no content  

Cleans up all the empty user directories in the uploads.    
