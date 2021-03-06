import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "POST") {
        const {
            // body: { question },
            body: { question, latitude, longitude },
            session: { user },
        } = req;
        if (latitude !== null && longitude !== null) {
            const post = await client.post.create({
                data: {
                    question,
                    latitude,
                    longitude,
                    user: {
                        connect: {
                            id: user?.id,
                        },
                    },
                },
            });
            // await res.unstable_revalidate("/community");
            res.json({
                ok: true,
                post,
            });
        } else {
            const post = await client.post.create({
                data: {
                    question,
                    user: {
                        connect: {
                            id: user?.id,
                        },
                    },
                },
            });
            res.json({
                ok: true,
                post,
            });
        }
    }
    if (req.method === "GET") {
        const {
            query: { page, longitude, latitude },
        } = req;
        if (latitude !== undefined && longitude !== undefined) {
            const parsedLatitude = parseFloat(latitude.toString());
            const parsedLongitude = parseFloat(longitude.toString());

            const total = await client.post.count();
            const posts = await client.post.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    _count: {
                        select: {
                            wonderings: true,
                            answers: true,
                        },
                    },
                },
                where: {
                    latitude: {
                        gte: parsedLatitude - 0.01,
                        lte: parsedLatitude + 0.01,
                    },
                    longitude: {
                        gte: parsedLongitude - 0.01,
                        lte: parsedLongitude + 0.01,
                    },
                },
                take: 10,
                skip: (+page.toString() - 1) * 10,
            });
            res.json({
                ok: true,
                total,
                posts,
            });
        } else {
            const total = await client.post.count();
            const posts = await client.post.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    _count: {
                        select: {
                            wonderings: true,
                            answers: true,
                        },
                    },
                },
                take: 10,
                skip: (+page.toString() - 1) * 10,
            });
            res.json({
                ok: true,
                total,
                posts,
            });
        }
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler,
    })
);
