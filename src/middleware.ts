/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { auth } from "auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from './routes';
import axios from "axios";
import { type NextRequest } from "next/server";
import { type Session } from "next-auth";
// export const middleware = auth;




export default auth(async (req: NextRequest & { auth: Session | null }): Promise<any> => {

    const isLoggedIn = !!req.auth;

    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (req.auth?.user?.accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${req.auth?.user.accessToken}`;
    }


    if (isPublicRoute) {
        return null
    }

    if (isApiAuthRoute) {
        return null
    }

    if (isAuthRoute && !isLoggedIn) {
        return null
    }


    if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute && !isAuthRoute) {

        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/login?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
    }

    if (isLoggedIn) {


        return null

    }

});

export const config = { matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)'], };
