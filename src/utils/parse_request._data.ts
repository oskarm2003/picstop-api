import { IncomingMessage } from "http"
import { cc } from ".."

const parseRequestData = (req: IncomingMessage): Promise<any> => {

    return new Promise((resolve, reject) => {

        let body = ''

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            if (body === '') resolve({})
            try {
                const parsed = JSON.parse(body)
                resolve(parsed)
            } catch (error) {
                cc.error('request data parsing error')
                resolve({})
            }
        })

    })
}

export default parseRequestData