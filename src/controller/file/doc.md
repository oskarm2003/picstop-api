# Files Controller
controls requests which url's start with /files


# POST /files  
Posts new file
multipart/form-data: {
    file: File,
    name: string
}  
*the name cannot include '\' or '/'

possible outcomes:
201 - created
401 - authorization failed
400 - error
418 - wrong data format or not enough data
