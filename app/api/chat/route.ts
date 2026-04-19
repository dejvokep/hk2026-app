import {NextRequest, NextResponse} from "next/server";
import {auth0} from "@/lib/auth0";
import {db} from "@/lib/db";
import {WithId} from "mongodb";
import {User} from "@/lib/types";
import {GoogleGenAI} from "@google/genai";
export async function POST(request: NextRequest) {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json(null, { status: 400 });

    const {message} = await request.json();
    if (!message) return NextResponse.json(null, { status: 400 });

    try {
        // Fetch user's groups with intents
        const groups = await (await db).db("tb").collection("groups").aggregate([
            {$match: {users: session.user.sub}},
            {
                $lookup: {
                    from: "users",
                    localField: "users",
                    foreignField: "sub",
                    as: "users"
                }
            }
        ]).toArray();

        const intents = await (await db).db("tb").collection("intents").aggregate([
            {$match: {group: {$in: groups.map(g => g._id.toHexString())}}},
            {
                $lookup: {
                    from: "groups",
                    localField: "group",
                    foreignField: "_id",
                    as: "groupData"
                }
            }
        ]).toArray();

        const contextData = {
            groups: groups.map(g => ({
                _id: g._id.toHexString(),
                name: g.name,
                remaining: g.remaining,
                due: g.due,
                users: g.users.map((u: WithId<Omit<User, "_id">>) => ({_id: u._id.toHexString(), name: u.name, email: u.email}))
            })),
            intents: intents.map(i => ({
                _id: i._id.toHexString(),
                name: i.name,
                type: i.type,
                value: i.value,
                currency: i.currency,
                group: i.group
            }))
        };

        const systemPrompt = `You are a helpful assistant for a shared expense and group management app called TatraShare. 
You have access to the user's groups and expense intents. Help them manage shared expenses, understand their spending patterns, and provide insights about their groups.

Current user's data:
${JSON.stringify(contextData, null, 2)}

Be concise and helpful. When discussing expenses, reference the specific groups and amounts. Be nice and ask if there is anything else to help with.`;

        // Call Gemini API
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

        const result = await ai.models.generateContent({
            model: "gemma-4-26b-a4b-it",
            contents: [{
                role: "user",
                parts: [{text: `${systemPrompt}\n\nUser: ${message}`}]
            }]
        });

        const reply = result.text || "Sorry, I couldn't generate a response.";

        // Save chat message to MongoDB
        await (await db).db("tb").collection("chat").insertOne({
            userId: session.user.sub,
            userMessage: message,
            assistantReply: reply,
            timestamp: new Date(),
            context: contextData
        });

        return NextResponse.json({reply}, {status: 200});
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({reply: "Sorry, something went wrong."}, {status: 200});
    }
}

