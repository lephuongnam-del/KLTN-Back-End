
var nodemailer = require('nodemailer');
var { SYS_ACCOUNT } = require('../configs/sys.config')

const sendMail = async (email, title, msg, callback) => {
    console.log(email, title, msg)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: SYS_ACCOUNT.EMAIL,
            pass: SYS_ACCOUNT.PASSWORD
        }
    });

    var mailOptions = {
        from: SYS_ACCOUNT.EMAIL,
        to: email,
        subject: title,
        text: msg
    };

    await transporter.sendMail(mailOptions, callback);
}

module.exports = {
    sendMail
}