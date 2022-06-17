import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    console.log("-------------------");
    console.log("click web hook comming~~~~~~");
    console.log("req");
    console.log(req);
    return res.json({
        ok: true,
    });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
