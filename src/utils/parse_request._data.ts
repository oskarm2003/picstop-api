import { IncomingMessage } from "http"

const parseRequestData = (req: IncomingMessage) => {

    return new Promise((resolve, reject) => {

        let body = ''

        req.on('data', (slice) => {
            body += slice.toString()
        })

        req.on('end', () => {
            try {
                resolve(JSON.parse(JSON.stringify(body)))
            } catch (error) {
                console.error("Error when parsing" + error)
                reject(error)
            }
        })

    })
}

export default parseRequestData