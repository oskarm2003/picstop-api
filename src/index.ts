import http, { IncomingMessage, ServerResponse } from 'http'
import userController from './controller/user/user_controller';
import ColorConsole from './utils/color_console';
import path from 'path'
import tagController from './controller/tag/tag_controller';
import commentsController from './controller/comments/comments_controller';
import photoController from './controller/photo/photo_controller';
import { readFile } from 'fs';
import photoSearchController from './controller/photo_search/photo_search_controller';
import { createDB, dbQuery } from './model/database/database_model'
require('dotenv').config()

//port number
const PORT = process.env.APP_PORT

//globals declaration
declare global {
    var root_dir: string
    var uploads_path: string
    var db_name: string
    var server_url: string
}
global.root_dir = path.join(__dirname, '..')
global.uploads_path = path.join(root_dir, "dist", "uploads")

if (!process.env.DB_NAME)
    throw new Error("DB_NAME environmental variable not found")
global.db_name = process.env.DB_NAME

//init DB
await createDB(global.db_name)

export const cc = new ColorConsole()
// cc.omit.push('notify')
export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {


    //default headers
    const trusted = ['https://picstop.onrender.com',
        'https://picstop.onrender.com/',]

    // console.log("ORIGIN:", req.headers.origin);
    for (let el of trusted) {
        if (el === req.headers.origin)
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    }

    res.setHeader('Access-Control-Allow-Headers', 'authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.end()
        return
    }

    res.setHeader('Content-Type', 'text/plain')

    global.server_url = 'http://' + req.headers.host

    //url undefined
    if (req.url === undefined) {
        res.end()
        return
    }

    const fragmented_url = req.url?.split('/')

    while (fragmented_url.length != 0 && fragmented_url[0] == "")
        fragmented_url.shift()

    const direction = fragmented_url[0]
    console.log("req.url", req.url);
    console.log("DIRECTION", direction);


    if (direction === undefined) {
        res.statusCode = 404
        res.end('action not found')
        return
    }

    //forward to user controller
    else if (direction === 'user') {
        userController(req, res)
    }

    else if (direction === 'photo') {

        if (req.url.split('/')[2] === 'search') {
            //forward to files search controller
            photoSearchController(req, res)
        }
        else {
            //forward to files controller
            photoController(req, res)
        }
    }

    //forward to tags controller
    else if (direction.startsWith('tag')) {
        tagController(req, res)
    }

    //forward to comments controller
    else if (direction.startsWith('comment')) {
        commentsController(req, res)
    }

    //send password change form
    else if (direction.startsWith('password_change')) {
        const filepath = path.join(global.root_dir, 'dist', 'html', 'password_change.html')

        readFile(filepath, (err, data) => {
            if (err) {
                cc.error(err)
                res.statusCode = 400
                res.end('error')
                return
            }
            res.setHeader('Content-Type', 'text/html')
            res.write(data)
            res.end()

        })
    }

    else {
        res.statusCode = 404
        res.end('action not found')
    }

})

server.listen(PORT, () => { console.log('app listening on port ' + PORT) })