import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "GET") {
        const {
            query: { page },
        } = req;
        const total = await client.product.count();
        const products = await client.product.findMany({
            take: 10,
            skip: (+page.toString() - 1) * 10,
            include: {
                _count: {
                    select: {
                        favs: true,
                    },
                },
            },
        });
        res.json({
            ok: true,
            total,
            products,
        });
    }
    if (req.method === "POST") {
        const {
            body: { name, price, description },
            session: { user },
        } = req;
        const product = await client.product.create({
            data: {
                name,
                price: +price,
                description,
                image: "xx",
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });
        res.json({
            ok: true,
            product,
        });
        res.status(200).end();
    }
}
export default withApiSession(
    withHandler({ methods: ["GET", "POST"], handler })
);
