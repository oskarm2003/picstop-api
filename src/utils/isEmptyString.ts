//check if strings are empty or undefined
function isEmptyString(...args: Array<string | undefined>) {

    for (let el of args) {
        if (el === '' || el === undefined) {
            return true
        }
    }

    return false
}

export default isEmptyString