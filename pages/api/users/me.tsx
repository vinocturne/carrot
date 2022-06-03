import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    console.log(req.session.user);
    const profile = await client.user.findUnique({
        where: {
            id: req.session.user?.id,
        },
    });
    res.json({
        ok: true,
        profile,
    });
    res.status(200).end();
}
export default withApiSession(withHandler("GET", handler));
