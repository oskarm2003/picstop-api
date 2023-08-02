import http, { IncomingMessage, ServerResponse } from 'http'
const PORT = 3000

http.createServer((req: IncomingMessage, res: ServerResponse) => {

    console.log(req.url);

    //url undefined
    if (req.url === undefined) {
        res.end()
        return
    }


    if (req.url?.startsWith('/user')) {

    }

})
    .listen(PORT, () => { console.log('listening on port ' + PORT) })