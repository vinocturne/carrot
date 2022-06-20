import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
interface AuthOptions {
    secure: boolean;
    auth: {
        api_key: string;
        domain: string;
        tracking: string;
        tracking_clicks: string;
        tracking_opens: string;
    };
    tls: {
        servername: string;
        rejectUnauthorized: boolean;
    };
}

const auth: AuthOptions = {
    secure: false,
    auth: {
        api_key: process.env.MAILGUN_PRIVATE_API!,
        domain: process.env.MAILGUN_DOMAIN!,
        tracking: "yes",
        tracking_clicks: "htmlonly",
        tracking_opens: "yes",
    },
    tls: {
        servername: "mg.mangakiss.jp",
        rejectUnauthorized: false,
    },
};
const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

export default nodemailerMailgun;
