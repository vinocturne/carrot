import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import crypto from "crypto";
interface Signature {
    signingKey: string;
    timestamp: string;
    token: string;
    signature: string;
}

const verify = ({ signingKey, timestamp, token, signature }: Signature) => {
    const encodedToken = crypto
        .createHmac("sha256", signingKey)
        .update(timestamp.concat(token))
        .digest("hex");

    return encodedToken === signature;
};

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { timestamp, token, signature } = req.body.signature;
    const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY!;
    const email = req.body.recipient;
    const event = req.body.event;
    console.log(req.body);
    const isVerified = verify({ signingKey, timestamp, token, signature });
    if (isVerified) {
        const user = await client.user.findFirst({
            where: {
                email,
            },
        });
        const emailDb = await client.emailEvent.create({
            data: {
                event,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });

        console.log(emailDb);
    }
    console.log("-------------------");
    console.log("emailOpen!!!!");
    return res.json({
        ok: true,
    });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
