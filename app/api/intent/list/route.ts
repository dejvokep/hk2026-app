import {NextRequest, NextResponse} from "next/server";
import {Intent} from "@/lib/types";
import {db, remapId} from "@/lib/db";
import {auth0} from "@/lib/auth0";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const intents = await (await db).db("tb").collection<Omit<Intent, "_id">>("intents").find({group: url.searchParams.get("group") || ""}).toArray();
    return NextResponse.json(intents.map(remapId), { status: 200 });
}