const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

transporter.verify(function (error, success) {
  if (error) {
    console.log('Email connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

async function sendVerificationEmail(toEmail, code) {

  const mailOptions = {
    from: process.env.EMAIL,
    to: toEmail,
    subject: 'Your Verification Code',
    text: `Your verification code is ${code}`
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendVerificationEmail }