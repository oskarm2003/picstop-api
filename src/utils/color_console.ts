class ColorConsole {

    private colors
    omit: Array<'log' | 'warn' | 'error' | 'success' | 'debug'>
    display: boolean

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
    }

    log = (message: string) => {
        if (this.display && !this.omit.includes("log"))
            console.log(this.colors.WHITE + message + this.colors._RESET)
    }

    warn = (message: string) => {
        if (this.display && !this.omit.includes("warn"))
            console.log(this.colors.YELLOW + message + this.colors._RESET)
    }

    error = (message: string) => {
        if (this.display && !this.omit.includes("error")) {
            console.log(this.colors.RED + message + this.colors._RESET)
        }
    }

    success = (message: string) => {
        if (this.display && !this.omit.includes("success")) {
            console.log(this.colors.GREEN + message + this.colors._RESET);
        }
    }

    debug = (message: string) => {
        if (this.display && !this.omit.includes("debug")) {
            console.log(this.colors.BLUE + message + this.colors._RESET);
        }
    }
}

export default ColorConsole