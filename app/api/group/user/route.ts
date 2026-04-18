import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {ObjectId} from "bson";

export async function POST(request: NextRequest) {
    const data: {group: string, user: string} = await request.json();
    await (await db).db("tb").collection("groups").updateOne(
        {_id: new ObjectId(data.group)},
        {$addToSet: {users: data.user}}
    );
    return NextResponse.json(null, { status: 200 });
}