import http, { IncomingMessage, ServerResponse } from 'http'
import userController from './controller/user/user_controller';
import ColorConsole from './utils/color_console';

const PORT = 3000
export const cc = new ColorConsole()

http.createServer((req: IncomingMessage, res: ServerResponse) => {

    //url undefined
    if (req.url === undefined) {
        res.end()
        return
    }

    //forward to user controller
    if (req.url?.startsWith('/user')) {
        userController(req, res)
    }

})
    .listen(PORT, () => { console.log('listening on port ' + PORT) })