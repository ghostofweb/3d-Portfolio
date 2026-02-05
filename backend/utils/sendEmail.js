import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // <--- THIS MUST BE FALSE FOR PORT 2525
    auth: {
      user: process.env.MAILTRAP_USER, 
      pass: process.env.MAILTRAP_PASS 
    }
  });

  const mailOptions = {
    from: '"GhostOfWeb Admin" <noreply@ghostofweb.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;