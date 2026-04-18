import {NextRequest, NextResponse} from "next/server";
import {auth0} from "@/lib/auth0";
import {db} from "@/lib/db";

export async function POST(request: NextRequest) {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    await (await db).db("tb").collection("intents").insertOne(await request.json());
    return NextResponse.json(null, { status: 200 });
}