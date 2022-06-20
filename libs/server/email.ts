import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
interface AuthOptions {
    secure: boolean;
    auth: {
        api_key: string;
        domain: string;
    };
    tls: { rejectUnauthorized: boolean };
    [key: string]: any;
}

const auth: AuthOptions = {
    secure: false,
    auth: {
        api_key: process.env.MAILGUN_PRIVATE_API!,
        domain: process.env.MAILGUN_DOMAIN!,
    },
    tls: { rejectUnauthorized: false },
    "X-Mailgun-Track": "yes",
};
const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

export default nodemailerMailgun;
