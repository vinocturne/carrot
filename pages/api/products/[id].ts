import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const { id } = req.query;
    const product = await client.product.findUnique({
        where: {
            id: +id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    const terms = product?.name.split(" ").map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedProducts = await client.product.findMany({
        where: {
            //연관된 상품 검색을 위해 OR 사용
            OR: terms,
            //그 중 현재 보고있는 상품을 제외하기 위해 and 사용.
            AND: {
                id: {
                    not: product?.id,
                },
            },
        },
    });
    console.log(relatedProducts);
    console.log(terms);
    res.json({ ok: true, product, relatedProducts });
}
export default withApiSession(withHandler({ methods: ["GET"], handler }));
