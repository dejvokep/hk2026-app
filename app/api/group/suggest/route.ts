import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { MongoClient, Db, AnyBulkWriteOperation } from "mongodb";

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

interface SimplifiedItem {
    simplifiedName: string;
    category: string;
}

type FallbackTier = "exact" | "product" | "category";

interface SplitStatDocument {
    userId: string;
    type: FallbackTier;
    value: string;
    targetUserIds: string[]; // Empty array [] means it was bought alone
    count: number;
}

interface SuggestionResult {
    suggestedTargetIds: string[] | null;
    reason: string;
    confidence: "high" | "medium" | "low" | "none";
}

interface ApiReceipt {
    vendor: string;
    currency: string;
    products: Array<{ name: string; price: number }>;
    total: number;
}

// ============================================================================
// 2. SETUP & CONFIGURATION
// ============================================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string,
});

const itemSchema = z.object({
    simplifiedName: z.string().describe("The core product name in lowercase, removing brand names or adjectives (e.g., 'toast bread' from 'Artisan Toast Bread')"),
    category: z.string().describe("The general category in lowercase (e.g., 'groceries', 'hygiene', 'utilities', 'entertainment')")
});

const geminiSchema = {
    type: "object",
    properties: {
        simplifiedName: { type: "string" },
        category: { type: "string" }
    },
    required: ["simplifiedName", "category"]
};

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "finance_app";
const COLLECTION_NAME = "split_stats";

// ============================================================================
// 3. CORE FUNCTIONS
// ============================================================================

/**
 * Step 1: Use Gemini to simplify the raw item name.
 */
async function simplifyItemName(rawItemName: string): Promise<SimplifiedItem> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    { text: `Analyze this receipt item and extract the simplified product name and category: "${rawItemName}"` }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
            temperature: 0.1,
        }
    });

    if (!response.text) {
        throw new Error("No response text received from the model.");
    }

    const rawJson = JSON.parse(response.text);
    return itemSchema.parse(rawJson);
}

/**
 * Step 2: Save the completed transaction.
 * Pass an empty array [] for targetUserIds if the user bought it alone.
 */
async function saveSplitData(
    db: Db,
    userId: string,
    rawName: string,
    simplifiedName: string,
    category: string,
    targetUserIds: string[]
): Promise<void> {
    const cleanRawName = rawName.toLowerCase().trim();
    const collection = db.collection<SplitStatDocument>(COLLECTION_NAME);

    // Sort the array of IDs so ["id_B", "id_A"] matches ["id_A", "id_B"] in the DB
    const sortedTargetIds = [...targetUserIds].sort();

    const updates: Array<{ type: FallbackTier; value: string }> = [
        { type: "exact", value: cleanRawName },
        { type: "product", value: simplifiedName },
        { type: "category", value: category }
    ];

    const bulkOps: AnyBulkWriteOperation<SplitStatDocument>[] = updates.map(item => ({
        updateOne: {
            filter: { userId: userId, type: item.type, value: item.value, targetUserIds: sortedTargetIds },
            update: { $inc: { count: 1 } },
            upsert: true
        }
    }));

    await collection.bulkWrite(bulkOps);

    const logTargets = sortedTargetIds.length === 0 ? "SOLO (No Split)" : `[${sortedTargetIds.join(', ')}]`;
    console.log(`Saved learning data for User [${userId}]: "${rawName}" -> Split with ${logTargets}`);
}

/**
 * Step 3: Suggest a split partner (or group).
 * Takes into account if the item is usually bought alone.
 */
async function suggestSplitPartner(
    db: Db,
    userId: string,
    rawName: string
): Promise<SuggestionResult> {
    console.log(`\nAnalyzing new item for User [${userId}]: "${rawName}"...`);
    const collection = db.collection<SplitStatDocument>(COLLECTION_NAME);

    const { simplifiedName, category } = await simplifyItemName(rawName);
    const cleanRawName = rawName.toLowerCase().trim();

    console.log(`LLM Parsed -> Product: [${simplifiedName}], Category: [${category}]`);

    // Helper function to query the DB for the highest count target array
    async function getTopSplitTarget(type: FallbackTier, value: string): Promise<string[] | null> {
        const topMatch = await collection
            .find({ userId: userId, type: type, value: value })
            .sort({ count: -1 })
            .limit(1)
            .toArray();

        return topMatch.length > 0 ? topMatch[0].targetUserIds : null;
    }

    // PRIORITY 1: Exact Match
    let suggestedGroupIds = await getTopSplitTarget("exact", cleanRawName);
    if (suggestedGroupIds) {
        if (suggestedGroupIds.length === 0) {
            return { suggestedTargetIds: null, reason: "usually bought alone (exact match)", confidence: "high" };
        }
        return { suggestedTargetIds: suggestedGroupIds, reason: "exact match", confidence: "high" };
    }

    // PRIORITY 2: Simplified Product
    suggestedGroupIds = await getTopSplitTarget("product", simplifiedName);
    if (suggestedGroupIds) {
        if (suggestedGroupIds.length === 0) {
            return { suggestedTargetIds: null, reason: `usually bought alone (${simplifiedName})`, confidence: "medium" };
        }
        return { suggestedTargetIds: suggestedGroupIds, reason: `similar product (${simplifiedName})`, confidence: "medium" };
    }

    // PRIORITY 3: Category Match
    suggestedGroupIds = await getTopSplitTarget("category", category);
    if (suggestedGroupIds) {
        if (suggestedGroupIds.length === 0) {
            return { suggestedTargetIds: null, reason: `usually bought alone in category (${category})`, confidence: "low" };
        }
        return { suggestedTargetIds: suggestedGroupIds, reason: `category match (${category})`, confidence: "low" };
    }

    // NO MATCH
    return { suggestedTargetIds: null, reason: "no history found", confidence: "none" };
}

// ============================================================================
// 4. API ROUTE HANDLER
// ============================================================================

export async function GET(request: Request): Promise<Response> {
    const client = new MongoClient(MONGO_URI);

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const receiptJson = searchParams.get("receipt");

        if (!userId || !receiptJson) {
            return Response.json(
                { error: "Missing required parameters: userId and receipt" },
                { status: 400 }
            );
        }

        const receipt: ApiReceipt = JSON.parse(receiptJson);

        if (!receipt.products || receipt.products.length === 0) {
            return Response.json(
                { error: "Receipt must contain at least one product" },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db(DB_NAME);

        // Get suggestions for each product in the receipt
        const suggestions = await Promise.all(
            receipt.products.map(product =>
                suggestSplitPartner(db, userId, product.name)
            )
        );

        return Response.json(
            {
                vendor: receipt.vendor,
                products: receipt.products.map((product, index) => ({
                    ...product,
                    suggestion: suggestions[index]
                }))
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET /api/group/suggest:", error);
        return Response.json(
            { error: "Internal server error", details: String(error) },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}

