import { createTransport } from 'nodemailer'
require('dotenv').config()

class Mailer {

    //connection
    private static connection = createTransport({
        service: 'Yahoo',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    //mail templates
    private static templates = {
        verification: (url: string) => `Click on the link to verify your account:\n${url}\n\nLink is active for one hour.\nThis message was send automatically, please do not respond.\nIgnore if you think you should not be the receiver.`,
        password_change: (url: string) => `You can reset your password with the link below:\n${url}\n\nLink is active for five minutes.\nThis message was send automatically, please do not respond.\nIgnore if you think you should not be the receiver.`
    }

    //send mails
    static send = {
        //account verification message
        verification: (receiver: string, url: string) => {
            return new Promise((resolve, reject) => {
                //preparing email
                const options = {
                    from: process.env.EMAIL_USER,
                    to: receiver,
                    subject: 'Verify your email',
                    text: this.templates.verification(url)
                }
                //sending email
                this.connection.sendMail(options, (err, info) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(info.response)
                })
            })
        },
        //password change message
        password_change: (receiver: string, url: string) => {
            return new Promise((resolve, reject) => {
                //preparing email
                const options = {
                    from: process.env.EMAIL_USER,
                    to: receiver,
                    subject: "Password change request",
                    text: this.templates.password_change(url)
                }
                //sending email
                this.connection.sendMail(options, (err, info) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(info.response)
                })
            })
        }
    }
}

export default Mailer