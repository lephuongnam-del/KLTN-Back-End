
var nodemailer = require('nodemailer');
var { SYS_ACCOUNT } = require('../configs/sys.config')

const sendMail = async (email, title, msg) => {
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
    console.log('mailOptions: ',mailOptions)
    try {
        let result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return { error };
    }
}

module.exports = {
    sendMail
}