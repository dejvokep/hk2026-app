import {NextResponse} from "next/server";
import {Group} from "@/lib/types";
import {db} from "@/lib/db";
import {auth0} from "@/lib/auth0";

export async function GET() {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const groups = await (await db).db("tb").collection<Omit<Group, "_id">>("groups").aggregate(
        [{$match: {users: session.user.sub}}, {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "sub",
                as: "users"
            }
        }]
    ).toArray();
    return NextResponse.json(groups, { status: 200 });
}