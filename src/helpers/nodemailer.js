//2. Body Template
//3. Send Method

import nodemailer from 'nodemailer';

export const accountVerificationEmail = async (obj) => {
  const { email, fname, link } = obj;
  //1. SMTP Mail Config

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"E - Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Account Activation Required.', // Subject line
    text: `Hello ${fname}, please follow the link to activate your account. ${link}`, // plain text body
    html: `<p>Hello ${fname}</p>
    <p>Please follow the link below to activate your account.</p>
        <br/>
        <br/><p><a href=${link}>${link}</a></p> 
        <br/>
        <br/>
        <p>Regards, <br/>
        E-Store <br/>
        Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};
export const accountVerifiedNotification = async (obj) => {
  const { email, fname } = obj;
  //1. SMTP Mail Config

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"E - Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Account verified.', // Subject line
    text: `Hello ${fname}, Your account has been verified. You may login now.`, // plain text body
    html: `<p>Hello ${fname}</p>
    <p>Your account has been verified. You may 
    <a href="${process.env.WEB_DOMAIN}">sign in</a> now.</p>
        <br/>
       
        <br/>
        <br/>
        <p>Regards, <br/>
        E-Store <br/>
        Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};

export const passwordChangeNotification = async (obj) => {
  const { email, fname } = obj;
  //1. SMTP Mail Config

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"E - Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Successfully updated password', // Subject line
    text: `Hello ${fname}, Your password has been successfully changed. If it was not you, please contact us immediately.`, // plain text body
    html: `<p>Hello ${fname}.</p>
    <p>Your password has been successfully changed. </p>
        <br/>
       <p>If it was not you, please contact us immediately. </p>
        
        <br/>
        <p>Regards, <br/>
        E-Store<br/>
        Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};

export const sendOTPNotification = async (obj) => {
  const { email, fname, otp } = obj;
  //1. SMTP Mail Config

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"E - Store" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Password Reset OTP', // Subject line
    text: `Hello ${fname}, Here is the OTP to reset your password. ${otp}`, // plain text body
    html: `<p>Hello ${fname}.</p>
    <p>Here is the OTP for password reset.
    <p>${otp}</p>
        <br/>
       <p>If you didn't request for the password change, please contact us. </p>
        <br/>
        <br/>
        <p>Regards, <br/>
        E-Store <br/>
        Customer Support Team</p>`, // html body
  });
  console.log('Message sent: %s', info.messageId);
};
