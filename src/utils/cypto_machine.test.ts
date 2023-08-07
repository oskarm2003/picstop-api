import CryptoMachine from "./crypto_machine"

describe('crypto', () => {

    const password = 'qwerty123'
    const hash = CryptoMachine.generate_hash(password)

    test('hash password', () => {

        expect(hash).not.toEqual(password)
        expect(hash).toContain('$')

    })

    test('match password', () => {

        expect(CryptoMachine.match('qwerty1234', hash)).toBeFalsy()
        expect(CryptoMachine.match(password, hash)).toBeTruthy()

    })

})