# tags_model file:

# countTag
Counts how many times does the given tag occur globally.  
input: tag_name: string  
output: promise with a number

# allTags
Lists all tags different tags and their popularities.  
no input
output: promise with an Array<{name:string, popularity: number}>

# addTag
Adds a new tag to the photo.  
If the tag exists the opperation is stopped.  
input: tag_name: string, photo_id: number  
output: promise with true

# removeTagFromPhoto
Removes a single tag from the given photo.  
input: tag_name: string, photo_id: number  
output: promise with true

# getPhotoTags
Lists all tags of the given photo.  
input: photo_id: number  
output: promise with an Array<string>

# removeAllTags
Removes all tags of the given photo.  
input: photo_id: number  
output: promise with true