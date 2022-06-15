import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.ua?.isBot) {
        return new Response("no bot in this area");
    }

    // api 접속을 제외하고 페이지 이동등의 상황에서 쿠키를 확인하여 세션이 없는 경우 enter 페이지로 이동할 수 있도록 미들웨어 구성
    if (!req.url.includes("/api")) {
        if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
            return NextResponse.redirect(new URL("/enter", req.url));
        }
    }
}
