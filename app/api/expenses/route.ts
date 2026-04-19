import {auth0} from "@/lib/auth0";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {Group, Intent} from "@/lib/types";

export async function GET() {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const groups = await (await db).db("tb").collection<Omit<Group, "_id" | "users"> & {users: string[]}>("groups").find({users: session.user.sub}).toArray();
    let intents = await (await db).db("tb").collection<Omit<Intent, "_id">>("intents").find().toArray();
    intents = intents.filter(i => i.expense && groups.find(g => g._id.toHexString() === i.group));

    const shares: {[k: string]: number} = {}
    const total = intents.reduce((a, b) => a + b.value, 0);

    intents.forEach(intent => shares[intent.expense!] = 0)
    intents.forEach(intent => shares[intent.expense!] += intent.value)
    for (const key in shares) shares[key] /= total;

    return NextResponse.json(shares, { status: 200 });
}