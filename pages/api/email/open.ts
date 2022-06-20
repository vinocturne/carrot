import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
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
    const id = req.body.recipient;
    console.log(req.body);
    const isVerified = verify({ signingKey, timestamp, token, signature });
    console.log("-------------------");
    console.log("emailOpen!!!!");
    return res.json({
        ok: true,
    });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
