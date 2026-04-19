import {NextRequest, NextResponse} from "next/server";
import {DEFAULT_IN_USE, processReceipt} from "@/lib/api/receipt-processor";

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file = data.get('image') as File | null; // 'image' matches your formData.append key

    if (!file || DEFAULT_IN_USE) {
        return NextResponse.json(await processReceipt(), { status: 200 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');

    return NextResponse.json(await processReceipt(base64String), { status: 200 });
}