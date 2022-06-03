import { withIronSessionApiRoute } from "iron-session/next";

const cookieOptions = {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PW!,
};

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions);
}
