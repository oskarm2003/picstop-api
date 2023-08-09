import { IncomingMessage } from 'http';
import { cc } from '../..';
// const formidable = require('formidable')
// import hexoid from 'hexoid'
const hexoid = require('hexoid')

console.log(hexoid(2)());


function post_image(req: IncomingMessage) {

    return new Promise(async (resolve, reject) => {
        // const form = formidable()
        // form.parse(req, (err, fields, files) => {

        //     if (err) {
        //         cc.error('FILE PARSE ERROR: ', err)
        //         reject(err)
        //     }

        //     console.log(files);
        //     console.log(fields);

        // })
    })

}

export { post_image }