import { createDescriptor } from "../photo/descriptor_model"
import { addTag, allTags, countTag, getPhotoTags, removeAllTags, removeTagFromPhoto } from "./tags_model"

describe('tags testing', async () => {

    //global db name change
    global.db_name = 'photos_test'
    await createDescriptor('user/file.png')

    test('add tag', async () => {

        //add tag
        await addTag('example_tag', 'user', 'file')

        //view tags
        let result = await allTags()

        expect(result[0].name).toBe('example_tag')

    })

    test('count tag', async () => {

        //add more tags
        await addTag('example_tag', 'user', 'file')
        await addTag('example_tag', 'user', 'file')

        //count
        let result = await countTag('example_tag')
        expect(result).toBe(3)

    })

    test('get all tags', async () => {

        //add more tags
        await addTag('smile', 'user', 'file')
        await addTag('smile', 'user', 'file')

        //check
        let result = await allTags()
        expect(result[0].popularity).not.toBeNaN()

    })


    test('get all photo tags', async () => {

        //add more tags
        await addTag('happy', 'user', 'file')
        await addTag('rainbow', 'user', 'file')

        //check
        let result = await getPhotoTags('user', 'file')
        expect(result.length).toBe(2)

    })

    test('remove single tag from photo', async () => {

        //remove
        await removeTagFromPhoto('example_tag', 'user', 'file')

        //check if deleted
        let result = await countTag('example_tag')
        expect(result).toBe(2)

    })

    test('remove all tags from the photo', async () => {

        //remove all
        await removeAllTags('user', 'file')

        //check
        let result = await getPhotoTags('user', 'file')
        expect(result.length).toBe(0)

    })

    // test('get tagged photos', async () => {

    // })
})