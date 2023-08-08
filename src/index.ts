import http, { IncomingMessage, ServerResponse } from 'http'
import userController from './controller/users/user_controller';
import ColorConsole from './utils/color_console';


const PORT = 3000
export const cc = new ColorConsole()
cc.omit.push('notify')
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

    else {
        res.statusCode = 404
        res.end('action not found')
    }

})

// server.listen(PORT, () => { console.log('listening on port ' + PORT) })