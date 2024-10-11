const nodemailer = require('nodemailer');
require("dotenv").config()
let pass = process.env.PASS
let smtpTransport = require("nodemailer-smtp-transport");
const SendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {
    let transporter = nodemailer.createTransport(
        smtpTransport ({
                service: "Gmail",
                auth: {
                    user: "alazadcmt@gmail.com",
                    pass: pass
                },
            }
        )
    );
    let mailOptions = {
        from: 'alazadcmt@gmail.com',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return  await transporter.sendMail(mailOptions)

}
module.exports=SendEmailUtility