import nodemailer from "nodemailer";
// import mailgun from "nodemailer-mailgun-transport";
// import Mailgun from "mailgun.js";

// const smtpTransport = nodemailer.createTransport({
//     service: "Naver",
//     host: "smtp.naver.com",
//     port: 587,
//     auth: {
//         user: process.env.MAIL_ID,
//         pass: process.env.MAIL_PASSWORD,
//     },
//     tls: {
//         rejectUnauthorized: false,
//     },
// });

// interface AuthOptions {
//     auth: {
//         api_key: string;
//         domain: string;
//     };
// }

// const auth: AuthOptions = {
//     auth: {
//         api_key: process.env.MAILGUN_PRIVATE_API!,
//         domain: process.env.MAILGUN_DOMAIN!,
//     },
// };
// const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

let transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
        user: process.env.MAILGUN_SMTP_ID,
        pass: process.env.MAILGUN_SMTP_PASS,
    },
});

export default transporter;
