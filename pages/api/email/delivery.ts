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
    console.log(req.body);
    const { timestamp, token, signature } = req.body.signature;
    const signingKey = process.env.MAILGUN_WEBHOOK_SIGNING_KEY!;
    const isVerified = verify({ signingKey, timestamp, token, signature });
    console.log("-------------------");
    console.log("webhook come here");
    return res.json({
        ok: true,
    });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });