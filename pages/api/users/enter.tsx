import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@libs/server/email";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { phone, email } = req.body;
    const user = phone ? { phone: phone } : email ? { email } : null;
    if (!user) return res.status(400).json({ ok: false });
    const payload = Math.floor(100000 + Math.random() * 900000) + "";
    //upsert 는 업데이트하거나 수정할때 많이 사용.
    //client.token의 connectOrCreate에서 해당 데이터가 있으면 바로 토큰과함께 연결을 진행하고
    //해당 데이터가 없다면 생성해주는 작업을 진행하기 때문에 user를 따로 만들지 않아도 됨.
    // const user = await client.user.upsert({
    //     where: {
    //         ...payload,
    //         // ...(phone && { phone: +phone }),
    //         // ...(email && { email }),
    //         // 위의 문법은 아래와 같음.
    //         // ...(phone ? {phone: +phone} : {}),
    //         // ...(email ? {email} : {}),
    //     },
    //     create: {
    //         name: "Anonymous",
    //         ...payload,
    //         // ...(phone && { phone: +phone }),
    //         // ...(email && { email }),
    //     },
    //     update: {},
    // });
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
        // const message = await twilioClient.messages.create({
        //     messagingServiceSid: process.env.TWILIO_SERVICE_SID,
        //     to: process.env.TWILIO_TEST_PHONE!,
        //     body: `Your login token is ${payload}`,
        // });
        // console.log(message);
    } else if (email) {
        // const mailOptions = {
        //     from: process.env.MAIL_ID,
        //     to: email,
        //     subject: "Nomad Carrot Authentication Email",
        //     html: `<strong>Authentication Code : ${payload}</strong>`,
        // };
        // const result = await smtpTransport.sendMail(
        //     mailOptions,
        //     (error, responses) => {
        //         if (error) {
        //             console.log(error);
        //             return null;
        //         } else {
        //             console.log(responses);
        //             return null;
        //         }
        //     }
        // );
        // smtpTransport.close();
        // console.log(result);
    }
    console.log(token);
    // if (email) {
    //     user = await client.user.findUnique({
    //         where: {
    //             email,
    //         },
    //     });
    //     if (user) console.log("found it");
    //     if (!user) {
    //         console.log("Did not find. Will create");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 email,
    //             },
    //         });
    //     }
    //     console.log(user);
    // }
    // if (phone) {
    //     user = await client.user.findUnique({
    //         where: {
    //             phone: +phone,
    //         },
    //     });
    //     if (user) console.log("found it");
    //     if (!user) {
    //         console.log("Did not find. Will create");
    //         user = await client.user.create({
    //             data: {
    //                 name: "Anonymous",
    //                 phone: +phone,
    //             },
    //         });
    //     }
    //     console.log(user);
    // }
    return res.json({
        ok: true,
    });
}
export default withHandler({ method: "POST", handler, isPrivate: false });
