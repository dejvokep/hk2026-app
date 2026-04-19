import {NextRequest, NextResponse} from "next/server";
import {processReceipt} from "@/lib/api/receipt-processor";

export async function POST(request: NextRequest) {
    return NextResponse.json(await processReceipt(), { status: 200 });
}