import { createDescriptor } from "../photo/descriptor_model"
import { addComment, deleteComment, editComment, getComments } from "./comments_model"

describe('comments testing', () => {

    //change testing db
    global.db_name = 'photos_test'

    test('add new comment', async () => {

        await createDescriptor('john/example')

        const result1 = await addComment(
            'john',
            'example',
            'john',
            'Such a cool photo!😀'
        )

        //test
        expect(result1).toBe('success')

        const result2 = await getComments('john', 'example')
        expect(result2.length).toBe(1)

    })

    test('path comment', async () => {

        const id = (await getComments('john', 'example'))[0].id
        expect(await editComment(id, 'john', 'new')).toBe('success')
        expect(await editComment(69, 'john', 'new')).toBe('not found')
        expect((await getComments('john', 'example'))[0].content).toBe('new')

    })

    test('remove comment', async () => {

        const id = (await getComments('john', 'example'))[0].id
        await deleteComment(id, 'john')
        expect((await getComments('john', 'example')).length).toBe(0)

    })

})