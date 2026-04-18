import { Auth0Client } from "@auth0/nextjs-auth0/server";
import {SdkError} from "@auth0/nextjs-auth0/errors";
import {OnCallbackContext, SessionData} from "@auth0/nextjs-auth0/types";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {defaultUser} from "@/lib/types";

export const auth0 = new Auth0Client({
    async onCallback(error: SdkError | null, ctx: OnCallbackContext, session: SessionData | null): Promise<NextResponse> {
        if (error)
            return NextResponse.redirect(new URL(`/error?msg=${error.message}`, process.env.APP_BASE_URL));

        if (session && session.user) {
            await (await db).db("tb").collection("users").updateOne(
                { sub: session.user.sub },
                {
                    $setOnInsert: {
                        name: session.user.name,
                        email: session.user.email,
                        tel: session.user.phone_number || defaultUser.tel,
                        sub: session.user.sub
                    }
                },
                { upsert: true }
            );
        }

        return NextResponse.redirect(new URL("/zone", process.env.APP_BASE_URL));
    },
    authorizationParameters: {scope: "openid profile email phone"}
});