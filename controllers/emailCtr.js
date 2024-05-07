const nodeMailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendEmail = asyncHandler(
    async(data, req, res) => {
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ID, // Generated ethereal user 
                pass: process.env.MAIL_PASS, // Generated ethereal password 
            }
        })

        //* Send Mail with defined tranport object
        let info = await transporter.sendMail({
            from: '"Hello There" <mohmoseyba3@gmail.com>', // Sender address
            to: data.to, // List of receivers
            subject: data.subject, // Subject line
            text: data.text,
            html: data.html, // HTML body
        })

        console.log("Message sent: %s", info.messageId)

        console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info) )
    }
)

module.exports = sendEmail