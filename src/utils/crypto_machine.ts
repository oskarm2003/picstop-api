import * as crypto from 'crypto'

class CryptoMachine {

    private static letters = 'abcdefghijklmnoprstuqwxyz'

    //generate new salt
    private static generate_salt(len: number) {
        let output = ''
        for (let i = 0; i < len; i++) {
            if (Math.floor(Math.random() * 2)) {
                output += Math.floor(Math.random() * 9)
            }
            else {
                output += this.letters[Math.floor(Math.random() * this.letters.length)]
            }
        }
        return output
    }

    //exclude salt from the hashed string
    private static get_salt(encrypted_string: string) {

        return encrypted_string.split('$')[0]

    }

    //hash a string
    private static hash(password: string, salt: string): string {

        const hash = crypto.createHash('sha256')
        hash.update(password + salt)
        return hash.digest('hex')

    }

    //generate new hash
    public static generate_hash(password: string): string {

        const salt = this.generate_salt(15)
        const hashed_password = this.hash(password, salt)
        return salt + '$' + hashed_password

    }

    //check if given password and hash are equal
    public static match(password: string, hashed: string): boolean {

        const salt = this.get_salt(hashed)

        if (hashed.split('$')[1] === this.hash(password, salt)) {
            return true
        }

        return false
    }

}

export default CryptoMachine