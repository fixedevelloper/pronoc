import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: ["/admin/:path*"],
};

export async function proxy(req: any) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("TOKEN:", token);

    // ❌ pas connecté
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🔒 accès admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (token.role !== "admin") {
            return NextResponse.redirect(
                new URL("/auth/login?error=unauthorized", req.url)
            );
        }
    }

    return NextResponse.next();
}