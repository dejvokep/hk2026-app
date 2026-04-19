import {NextRequest, NextResponse} from "next/server";
import {auth0} from "@/lib/auth0";
import {db} from "@/lib/db";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const intentData = await request.json();
    const database = await db;

    // Insert the intent
    await database.db("tb").collection("intents").insertOne(intentData);

    // Update the group's remaining field by adding the intent value
    if (intentData.group && intentData.value) {
        await database.db("tb").collection("groups").updateOne(
            {_id: new ObjectId(intentData.group)},
            {$inc: {remaining: intentData.value}}
        );
    }

    return NextResponse.json(null, { status: 200 });
}