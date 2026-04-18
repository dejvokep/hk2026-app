import {ReactNode} from "react";
import {auth0} from "@/lib/auth0";
import {redirect} from "next/navigation";
import UserContextWrapper from "@/components/user-context-wrapper";
import {db} from "@/lib/db";
import {defaultUser, User} from "@/lib/types";

export default async function Layout({children}: Readonly<{children: ReactNode}>) {
    const session = await auth0.getSession();
    if (!session) redirect("/auth/login");

    const user = await (await db).db("tb").collection<Omit<User, "_id">>("users").findOne({sub: session.user.sub})
    return <UserContextWrapper user={user ? {...user, _id: user._id.toHexString()} : defaultUser}>
        {children}
    </UserContextWrapper>
}