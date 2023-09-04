import path from "path"
import { cleanUp, createNewAlbum, deleteImage, postImage, removeAsset } from "./file_model"
import fs, { copyFileSync, existsSync } from 'fs'
import { createDescriptor, deleteDescriptor, readDescriptor } from "./descriptor_model"

describe('file testing', () => {

    global.db_name = 'photos_test'

    test('create album', async () => {
        expect(await createNewAlbum('example')).toBeTruthy()
        expect(fs.existsSync(path.join(uploads_path, 'example'))).toBeTruthy()
    })

    test('post new photo', async () => {

        //copy file for testing
        copyFileSync(path.join(global.root_dir, 'example.png'), path.join(global.root_dir, 'monkey.png'))

        //file test
        let filepath = await postImage(path.join(global.root_dir, 'monkey.png'), 'monkey', 'john')
        expect(filepath.ok).toBeTruthy()
        if (!filepath.ok) {
            throw 'posting error'
        }
        expect(existsSync(filepath.path)).toBeTruthy()

        //descriptor test
        await createDescriptor(filepath.path)
        const descriptor = await readDescriptor('john', 'monkey')
        if (Array.isArray(descriptor)) {
            throw 'wrong read descriptor output'
        }
        expect(descriptor.name).toBe('monkey')

    })

    test('remove photo', async () => {

        const descriptor = await readDescriptor('john', 'monkey')
        if (Array.isArray(descriptor)) {
            throw 'wrong read descriptor output'
        }

        deleteImage(descriptor.album, descriptor.name)

        const filepath = path.join(uploads_path, descriptor.album, descriptor.name + 'png')
        expect(existsSync(filepath)).toBeFalsy()

        await deleteDescriptor(descriptor.album, descriptor.name)
        const result = await readDescriptor(descriptor.album)
        if (!Array.isArray(result)) {
            throw 'wrong read descriptor output'
        }

        expect(result.length).toBe(0)

    })

    test('clean up', async () => {

        const file_path = path.join(global.root_dir, 'dist', 'uploads', 'toBeCleared')
        await createNewAlbum('toBeCleared')

        expect(existsSync(file_path)).toBeTruthy()
        await cleanUp()
        expect(existsSync(file_path)).toBeFalsy()

    })
})