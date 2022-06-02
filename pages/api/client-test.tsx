import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await client.user.create({
        data: {
            email: "hago@kakao.com",
            name: "hago",
        },
    });
    res.json({
        ok: true,
    });
}
