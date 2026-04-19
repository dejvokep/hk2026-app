import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log("Payment request received:", body);
    return NextResponse.json(null, { status: 200 });
}