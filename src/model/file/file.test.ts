import path from "path"
import { cleanUp, create_new_album, post_image, remove_asset } from "./file_model"
import fs, { existsSync } from 'fs'

describe('file testing', () => {

    test('create album', async () => {
        expect(await create_new_album('example')).toBeTruthy()
        expect(fs.existsSync(path.join(uploads_path, 'example'))).toBeTruthy()
    })

    // test('remove album', async () => {
    //     expect(await remove_asset(path.join(uploads_path, 'example'))).toBeTruthy()
    //     expect(fs.existsSync(path.join(uploads_path, 'example'))).toBeFalsy()
    // })

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

    //test('delete photo', ()=>{})

    test('clean up', async () => {

        const file_path = path.join(global.root_dir, 'dist', 'uploads', 'example')

        expect(existsSync(file_path)).toBeTruthy()
        await cleanUp()
        expect(existsSync(file_path)).toBeFalsy()

    })
})