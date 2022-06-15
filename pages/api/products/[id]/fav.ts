import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
        session: { user },
    } = req;
    const alreadyExists = await client.fav.findFirst({
        where: {
            productId: +id.toString(),
            userId: user?.id,
        },
    });
    if (alreadyExists) {
        //좋아요가 이미 있으면 삭제
        await client.fav.delete({
            where: {
                id: alreadyExists.id,
            },
        });
    } else {
        //좋아요가 없으면 생성
        await client.fav.create({
            data: {
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
                product: {
                    connect: {
                        id: +id.toString(),
                    },
                },
            },
        });
    }
    res.json({ ok: true });
}
export default withApiSession(withHandler({ methods: ["POST"], handler }));
