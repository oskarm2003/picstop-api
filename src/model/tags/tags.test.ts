import { addTag, allTags, countTag, getPhotoTags, removeAllTags, removeTagFromPhoto } from "./tags_model"

describe('tags test', () => {

    //global db name change
    global.db_name = 'photos_test'

    test('add tag', async () => {

        //add tag
        await addTag('example_tag', 1)

        //view tags
        let result = await allTags()

        expect(result[0].name).toBe('example_tag')

    })

    test('count tag', async () => {

        //add more tags
        await addTag('example_tag', 2)
        await addTag('example_tag', 3)

        //count
        let result = await countTag('example_tag')
        expect(result).toBe(3)

    })

    test('get all tags', async () => {

        //add more tags
        await addTag('smile', 1)
        await addTag('smile', 2)

        //check
        let result = await allTags()
        console.log(result);
        expect(result[0].popularity).not.toBeNaN()

    })


    test('get all photo tags', async () => {

        //add more tags
        await addTag('smile', 1)
        await addTag('rainbow', 1)

        //check
        let result = await getPhotoTags(1)
        expect(result.length).toBe(3)

    })

    test('remove single tag from photo', async () => {

        //remove
        await removeTagFromPhoto('example_tag', 1)

        //check if deleted
        let result = await countTag('example_tag')
        expect(result).toBe(2)

    })

    test('remove all tags from the photo', async () => {

        //remove all
        await removeAllTags(1)

        //check
        let result = await getPhotoTags(1)
        expect(result.length).toBe(0)

    })

    // test('get tagged photos', async () => {

    // })
})