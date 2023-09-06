# tags_model file:

# countTag
input: tag_name: string  
output: promise with a number

Counts how many times does the given tag occur globally.  

# allTags
no input
output: promise with an Array<{name:string, popularity: number}>

Lists all tags different tags and their popularities.  

# addTag
input: tag_name: string, photo_id: number  
output: promise with true

Adds a new tag to the photo.  
If the tag exists the opperation is stopped.  

# removeTagFromPhoto
input: tag_name: string, photo_id: number  
output: promise with true

Removes a single tag from the given photo.  

# getPhotoTags
input: photo_id: number  
output: promise with an Array<string>

Lists all tags of the given photo.  

# removeAllTags
input: photo_id: number  
output: promise with true

Removes all tags of the given photo.  

# deleteTagsByPhotoAuthor
input: author: string
output: void promise

Removes the tags connected to the photos by the given author.  