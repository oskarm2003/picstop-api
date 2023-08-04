class ColorConsole {

    private colors
    omit: Array<'log' | 'warn' | 'error' | 'success' | 'notify'>
    display: boolean
    object_no_parse: boolean

    constructor() {
        this.colors = {
            'WHITE': '\x1b[37m',
            'RED': '\x1b[31m',
            'GREEN': '\x1b[32m',
            'YELLOW': '\x1b[33m',
            'BLUE': '\x1b[34m',
            'CYAN': '\x1b[36m',
            'MAGENTA': '\x1b[35m',
            '_RESET': '\x1b[0m'
        }
        this.omit = []
        this.display = true
        this.object_no_parse = false
    }

    //custom stringify option
    private stringify(what: [any]): Array<string> {
        let output = []
        for (let el of what) {
            if (el instanceof Array) {
                output.push(('[ ' + el + ' ]').replace(/,/g, ', '))
            }
            else if (el instanceof Object && !this.object_no_parse) {
                output.push(JSON.stringify(el))
            }
            else {
                output.push(el + '')
            }
        }
        return output
    }

    //colorful logs
    log(...message: any) {
        if (this.display && !this.omit.includes("log")) {
            message = this.stringify(message)
            console.log(this.colors.WHITE, ...message, this.colors._RESET)
        }
    }

    warn(...message: any) {
        if (this.display && !this.omit.includes("warn")) {
            message = this.stringify(message)
            console.log(this.colors.YELLOW, ...message, this.colors._RESET)
        }
    }

    error(...message: any) {
        if (this.display && !this.omit.includes("error")) {
            message = this.stringify(message)
            console.log(this.colors.RED, ...message, this.colors._RESET)
        }
    }

    success(...message: any) {
        if (this.display && !this.omit.includes("success")) {
            message = this.stringify(message)
            console.log(this.colors.GREEN, ...message, this.colors._RESET);
        }
    }

    notify(...message: any) {
        if (this.display && !this.omit.includes("notify")) {
            message = this.stringify(message)
            console.log(this.colors.BLUE, ...message, this.colors._RESET);
        }
    }
}

export default ColorConsole