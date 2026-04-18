import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {Group} from "@/lib/types";

export async function POST(request: NextRequest) {
    const group: Omit<Group, "_id"> = await request.json();
    const document = await (await db).db("tb").collection("groups").insertOne(group);
    return NextResponse.json(document.insertedId, { status: 200 });
}