import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@libs/server/email";
import twilio from "twilio";
import nodemailerMailgun from "@libs/server/email";
import main from "@libs/server/email";
import transporter from "../../../libs/server/email";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    const user = phone ? { phone: phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    const token = await client.token.create({
        data: {
            payload,
            user: {
                connectOrCreate: {
                    where: {
                        ...user,
                    },
                    create: {
                        name: "Anonymous",
                        ...user,
                    },
                },
            },
        },
    });
    if (phone) {
        const message = await twilioClient.messages.create({
            messagingServiceSid: process.env.TWILIO_SERVICE_SID,
            to: process.env.TWILIO_TEST_PHONE!,
            body: `Your login token is ${payload}`,
        });
        // console.log(message);
    }
    if (email) {
        const mailOptions = {
            from: "postmaster@mg.mangakiss.jp",
            to: email,
            subject: "Nomad Carrot Authentication Email",
            html: `<strong>Authentication Code : ${payload}</strong><br>
            <h2>바로가기 <a href="https://www.naver.com">캐럿캐럿</a></h2>`,
        };

        await new Promise((resolve, reject) => {
            nodemailerMailgun.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    }
    console.log(token);
    return res.json({
        ok: true,
    });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
