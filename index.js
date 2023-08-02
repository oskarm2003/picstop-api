import http from 'http';
const PORT = 3000;
http.createServer((req, res) => {
    var _a;
    console.log(req.url);
    //url undefined
    if (req.url === undefined) {
        res.end();
        return;
    }
    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/user')) {
    }
})
    .listen(PORT, () => { console.log('listening on port ' + PORT); });
