import { create_user, get_all_users, get_user_data, user_login } from "./user_model"

describe('users test', () => {

    //global db name change
    db_name = 'photos_test'

    const user = { username: 'John', email: 'john@email.com', password: 'ILoveCanada' }

    test('get users - empty', async () => {

        const result = await get_all_users()
        expect(result).toEqual([])

    })

    test('create user', async () => {

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

    test('get one user', async () => {

        const user_data = await get_user_data({ username: user.username })
        expect(user_data?.id).not.toBeUndefined()
        expect(user_data?.username).not.toBeUndefined()
        expect(user_data?.email).not.toBeUndefined()
        expect(await get_user_data({ email: user.email })).toBeInstanceOf(Object)
        expect(await get_user_data({ id: user_data?.id })).toBeInstanceOf(Object)
        expect(await get_user_data({})).toBeNull()

    })

    test('user authentication', async () => {

        expect(await user_login({ email: user.email, password: user.password })).toBe('success')
        expect(await user_login({ username: user.username, password: user.password })).toBe('success')
        expect(await user_login({ password: user.password })).toBe('not enough data')
        expect(await user_login({ username: user.username, password: 'ILoveanada' })).toBe('authentication failed')
        expect(await user_login({ email: 'johnny', password: user.password })).toBe('not found')

    })

})