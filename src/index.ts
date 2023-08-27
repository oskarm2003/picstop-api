import http, { IncomingMessage, ServerResponse } from 'http'
import userController from './controller/user/user_controller';
import ColorConsole from './utils/color_console';
import fileController from './controller/file/file_controller';
import path from 'path'

//gloabals declaration
declare global {
    var root_dir: string
    var uploads_path: string
}
global.root_dir = path.join(__dirname, '..')
global.uploads_path = path.join(root_dir, "dist", "uploads")

const PORT = 3000
export const cc = new ColorConsole()
// cc.omit.push('notify')
export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

    //default headers
    res.setHeader('Access-Controll-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/plain')

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
    else if (direction === 'file') {
        fileController(req, res)
    }

    else {
        res.statusCode = 404
        res.end('action not found')
    }

})

server.listen(PORT, () => { console.log('listening on port ' + PORT) })