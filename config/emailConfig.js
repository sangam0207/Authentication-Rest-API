const dotenv=require('dotenv');
dotenv.config();
const nodemailer=require('nodemailer');
let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  module.exports=transporter;