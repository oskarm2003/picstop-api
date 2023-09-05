# POST /tag  
Adds a new tag to a photo.  
input: {tag_name: string, photo_author: string, photo_name: string} as application/json.  
**when author argument is set to 'anonymous' or omitted completely the _shared album will be searched for file_name and the authorization will not be required.  
**tag name cannot include: '/', '\', ',', '.'  
**requires authorization -> Bearer [token] in a authorization header.  

possible outcomes: 
    201 - created  
    400 - error

# GET /tag/popularity/[tag_name]
Sends the number of photos that have this tag.  
Tag name provided in the url.  

possible outcomes:  
    200 - number
    404 - tag not found

# GET /tags/[photo_author]/[photo_name]
Sends all tag names of the given photo.  
Album and photo names provided in the url. 
**If album_name set to anonymous the photo will be searched in the _shared album.   

possible outcomes:  
    200 - tags
    400 - error
    404 - not found

# GET /tag/photos/[tag_name]
Sends names and albums of photos with given tag.  
Tag name provided in the url.

possible outcomes:
    200 - photos
    400 - error

# DELETE /tag/[photo_author]/[photo_name]/[tag_name]
Deletes the tag.  
Data (album_name, photo_name, tag_name) is provided in the url.  
Requires authorization if the photo has an owner.  
**If album_name set to anonymous the photo will be searched in the _shared album.   

possible outcomes:
    200 - success  
    400 - error  
    401 - authorization failed  