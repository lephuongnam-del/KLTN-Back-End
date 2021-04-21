
var nodemailer = require('nodemailer');
var { SYS_ACCOUNT } = require('../configs/sys.config')

const sendMail =  (email, title, msg) => {
    // console.log(email, title, msg)
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

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendMail
}