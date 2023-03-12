const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (session) => {
  session.authNumber = Math.floor(Math.random() * 1000000);
  try {
    await transporter.sendMail({
      from: process.env.MAIL_ADDRESS,
      to: session.email,
      // to: process.env.MAIL_ADDRESS,
      subject: "Express login auth number",
      html: `<h1>Enter the following code to log in:</h1>
            <h2>${session.authNumber}</h2>`,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
