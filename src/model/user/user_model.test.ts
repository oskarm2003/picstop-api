import { createUser, getAllUsers, getUserData, userLogin } from "./user_model"

describe('users testing', () => {

    //global db name change
    db_name = 'photos_test'

    const user = { username: 'John', email: 'john@email.com', password: 'ILoveCanada' }

    test('get users - empty', async () => {

        const result = await getAllUsers()
        expect(result).toEqual([])

    })

    test('create user', async () => {

        await createUser(user)
        const result = await getAllUsers()
        expect(result.length).toBe(1)

    })

    test('get users - data validation', async () => {

        const result = await getAllUsers()
        expect(result[0].password).toBeUndefined()
        expect(result[0].username).not.toBeUndefined()
        expect(result[0].email).not.toBeUndefined()

    })

    test('get one user', async () => {

        const user_data = await getUserData(user.username)
        expect(user_data?.id).not.toBeUndefined()
        expect(user_data?.username).not.toBeUndefined()
        expect(user_data?.email).not.toBeUndefined()
        expect(await getUserData(user.email)).toBeInstanceOf(Object)

    })

    test('user authentication', async () => {

        expect(await userLogin({ email: user.email, password: user.password })).toBe('success')
        expect(await userLogin({ username: user.username, password: user.password })).toBe('success')
        expect(await userLogin({ password: user.password })).toBe('not enough data')
        expect(await userLogin({ username: user.username, password: 'ILoveanada' })).toBe('authentication failed')
        expect(await userLogin({ email: 'johnny', password: user.password })).toBe('not found')

    })

})