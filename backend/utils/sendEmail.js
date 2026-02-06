import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL, 
      pass: process.env.GMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: `"GhostOfWeb" <${process.env.GMAIL}>`, 
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  return await transporter.sendMail(mailOptions)
};

export default sendEmail;