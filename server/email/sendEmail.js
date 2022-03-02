const nodemailer = require('nodemailer');
require('dotenv').config();
const sendingEmail = process.env.SENDING_EMAIL;
const sendingPassword = process.env.SENDING_PASSWORD;

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function sendEmail({
  recipient,
  subject,
  html,
  attachments,
}) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Yahoo',
      secure: true,
      auth: {
        user: sendingEmail,
        pass: sendingPassword,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Sterling Ad Sales" <${sendingEmail}>`, // sender address
      to: recipient, // list of receivers
      subject,
      html,
      attachments,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error(err);
  }
};
