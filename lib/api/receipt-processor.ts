import "dotenv/config"; // 1. Load the .env file FIRST
import {GoogleGenAI} from "@google/genai";
import {z} from "zod";
import * as fs from "fs";

// 2. Now the environment variable is loaded and explicitly passed
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// 2. Define your Zod schema (Identical to your original code)
const receiptSchema = z.object({
    name: z.string(),
    expense: z.string(),
    vendor: z.string(),
    currency: z.string(),
    products: z.array(z.object({
        name: z.string(),
        price: z.number(),
    })),
    total: z.number(),
});

// Build the proper schema structure for Gemini
const geminiSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        expense: { type: "string" },
        vendor: { type: "string" },
        currency: { type: "string" },
        products: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    price: { type: "number" }
                },
                required: ["name", "price"]
            }
        },
        total: { type: "number" }
    },
    required: ["vendor", "currency", "products", "total", "name", "expense"]
};

export async function processReceipt() {
    // 3. Prepare the image
    const imageBase64 = fs.readFileSync("req-tmp.jpg").toString("base64");

    // ...existing code...
    const response = await ai.models.generateContent({
        model: "gemma-4-26b-a4b-it", // Fast, highly capable multimodal model ideal for OCR
        contents: [
            {
                role: "user",
                parts: [
                    { text: "Please read and structure the receipt into the given format. According to the content, assign a short descriptive name and also the expense category - one of GAS, LEISURE, BEAUTY, GROCERIES, RENT. YOU MUST ADHERE TO THE FORMAT! Try to be fast. Convert CZK to EUR (currency set to the euro character) with an exchange rate of 24.3, rounded to two decimal places." },
                    { inlineData: { mimeType: "image/jpeg", data: imageBase64 } }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: geminiSchema,
        }
    });

    if (!response.text) {
        throw new Error("No response text received from the model.");
    }

    // 5. Parse the model's text response and validate it strictly through Zod
    const rawJson = JSON.parse(response.text);
    return receiptSchema.parse(rawJson)
}