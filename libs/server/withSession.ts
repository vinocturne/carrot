import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

const cookieOptions = {
    cookieName: "carrotsession",
    password: process.env.COOKIE_PW!,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export function withApiSession(fn: any) {
    return withIronSessionApiRoute(fn, cookieOptions);
}

export function withSsrSession(handler: any) {
    withIronSessionSsr(handler, cookieOptions);
}
