import path from "path"
import { create_new_album, post_image, remove_asset } from "./file_model"
import fs from 'fs'
import FormData from 'form-data'
import { IncomingMessage } from "http"
import { Socket } from "net"

describe('file testing', () => {

    test('create album', async () => {
        expect(await create_new_album('example')).toBeTruthy()
        expect(fs.existsSync(path.join(uploads_path, 'example'))).toBeTruthy()
    })

    test('remove album', async () => {
        expect(await remove_asset(path.join(uploads_path, 'example'))).toBeTruthy()
        expect(fs.existsSync(path.join(uploads_path, 'example'))).toBeFalsy()
    })

    // test('post new photo', () => {

    //     const form_mock = new FormData()
    //     form_mock.append('name', 'example_name')
    //     let result = fs.readFileSync(path.join(global.root_dir, 'example.png'))
    //     form_mock.append('file', result)
    //     expect(
    //         post_image({ body: form_mock } as unknown as IncomingMessage, 'john')
    //     ).toBe(false)

    //     //TODO: fix and finish
    //     // new IncomingMessage('' as unknown as Socket)

    // })
})