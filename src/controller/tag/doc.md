# Tag Controller
Handler requests which urls start with /tag.  
Uses model/tag to manage tags in the database.   


# POST /tag  
INPUT: {  
    tag_name: string,   
    photo_author: string,   
    photo_name: string  
    }  

POSSIBLE OUTCOMES:   
    201 - created    
    400 - error  


Adds a new tag to a photo and stores it in the database.  
When author argument is set to 'anonymous' or omitted completely the _shared album will be searched for file_name and the authorization will not be required.  
Tag name cannot include: / \ , .  
Operation requires authorization - 'Bearer [token]' in the authorization header.    

# GET /tag/popularity/[tag_name]
INPUT in the url   
    [tag_name] - string  

POSSIBLE OUTCOMES:   
    200 - number  
    404 - tag not found  


Sends the number of photos with the tag given in the url.  

# GET /tags/[photo_author]/[photo_name]
INPUT in the url  
    [photo_author] - string  
    [photo_name] - string  

POSSIBLE OUTCOMES:   
    200 - tags  
    400 - error  
    404 - not found  


Sends all tags of the given photo.  
If album_name set to 'anonymous' the photo will be searched in the _shared album.   

# GET /tag/photos/[tag_name]
INPUT in the url  
    [tag_name] - string  

POSSIBLE OUTCOMES:  
    200 - photos  
    400 - error  


Sends names and albums of photos with given tag.  

# DELETE /tag/[photo_author]/[photo_name]/[tag_name]
INPUT in the url  
    [photo_author] - string  
    [photo_name] - string  
    [tag_name] - string  

POSSIBLE OUTCOMES:  
    200 - success    
    400 - error  
    401 - authorization failed  


Deletes the tag.  
Operation requires authorization - 'Bearer [token]' in the authorization header.    
If album_name set to 'anonymous' the photo will be searched in the _shared album.   
