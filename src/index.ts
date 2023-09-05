import http, { IncomingMessage, ServerResponse } from 'http'
import userController from './controller/user/user_controller';
import ColorConsole from './utils/color_console';
import path from 'path'
import tagController from './controller/tag/tag_controller';
import commentsController from './controller/comments/comments_controller';
import photoController from './controller/photo/photo_controller';
import { readFile } from 'fs';
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
global.db_name = 'photos_db'


export const cc = new ColorConsole()
// cc.omit.push('notify')
export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

    //default headers
    res.setHeader('Access-Controll-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/plain')

    global.server_url = 'http://' + req.headers.host

    //url undefined
    if (req.url === undefined) {
        res.end()
        return
    }

    const direction = req.url?.split('/')[1]

    //forward to user controller
    if (direction === 'user') {
        userController(req, res)
    }

    //forward to files controller
    else if (direction === 'photo') {
        photoController(req, res)
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

server.listen(PORT, () => { console.log('listening on port ' + PORT) })