import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const user = req.nextauth?.token?.email;

        if (
            ["/dashboard", "/editor", "/drivers"].some((path) =>
                req.nextUrl.pathname.startsWith(path)
            )
        ) {
            if (user !== adminEmail) {
                return NextResponse.redirect(new URL("/home", req.url));
            }
        }
    },
    {
        pages: {
            signIn: "/", 
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/editor/:path*",
        "/drivers/:path*",
        "/rented/:path*",
        "/available/:path*",
        "/home/:path*",
    ],
};
