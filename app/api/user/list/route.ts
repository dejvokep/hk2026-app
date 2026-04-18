import {auth0} from "@/lib/auth0";
import {NextResponse} from "next/server";
import {db, remapId} from "@/lib/db";
import {User} from "@/lib/types";

export async function GET() {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const users = await (await db).db("tb").collection<Omit<User, "_id">>("users").find().toArray();
    return NextResponse.json(users.map(remapId), { status: 200 });
}