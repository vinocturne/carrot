import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";

interface AuthOptions {
    auth: {
        api_key: string;
        domain: string;
    };
}

const auth: AuthOptions = {
    auth: {
        api_key: process.env.MAILGUN_PRIVATE_API!,
        domain: process.env.MAILGUN_DOMAIN!,
    },
};
const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

export default nodemailerMailgun;
