import { create_user, get_all_users } from "./user_model"

describe('users test', () => {

    db_name = 'photos_test'

    test('get users - empty', async () => {

        const result = await get_all_users()
        expect(result).toEqual([])

    })

    test('create user', async () => {

        const user = { username: 'John', email: 'john@email.com', password: 'ILoveCanada' }
        await create_user(user)
        const result = await get_all_users()
        expect(result.length).toBe(1)

    })

    test('get users - data validation', async () => {

        const result = await get_all_users()
        expect(result[0].password).toBeUndefined()
        expect(result[0].username).not.toBeUndefined()
        expect(result[0].email).not.toBeUndefined()

    })

})