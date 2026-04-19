import {NextRequest, NextResponse} from "next/server";
import {auth0} from "@/lib/auth0";
import {db} from "@/lib/db";
import {ObjectId} from "mongodb";
import {Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction} from "@solana/web3.js";

interface WalletTransferRequest {
    fromWallet: string;
    toWallet: string;
    amount: number;
    groupId: string;
    description?: string;
}

// Initialize Solana connection
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Get or create keypair from environment
function getTransferKeypair(): Keypair {
    const secretKeyString = process.env.SOLANA_PAYER_SECRET_KEY || "";
    if (!secretKeyString) {
        // Generate a new keypair for demo
        return Keypair.generate();
    }
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

export async function POST(request: NextRequest) {
    const session = await auth0.getSession();
    if (!session) return NextResponse.json({error: "Unauthorized"}, {status: 400});

    try {
        const body: WalletTransferRequest = await request.json();
        const {fromWallet, toWallet, amount, groupId, description} = body;

        // Validate required fields
        if (!fromWallet || !toWallet || !amount || !groupId) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        // Validate amount
        if (amount <= 0) {
            return NextResponse.json({error: "Amount must be greater than 0"}, {status: 400});
        }

        const database = await db;

        // Verify user is part of the group
        const group = await database.db("tb").collection("groups").findOne({
            _id: new ObjectId(groupId),
            users: session.user.sub
        });

        if (!group) {
            return NextResponse.json({error: "Group not found or access denied"}, {status: 403});
        }

        // Verify source wallet exists and has sufficient balance
        const fromWalletDoc = await database.db("tb").collection("wallets").findOne({
            walletNumber: fromWallet,
            userId: session.user.sub
        });

        if (!fromWalletDoc) {
            return NextResponse.json({error: "Source wallet not found"}, {status: 404});
        }

        if ((fromWalletDoc.balance || 0) < amount) {
            return NextResponse.json({error: "Insufficient balance"}, {status: 400});
        }

        // Verify target wallet exists
        const toWalletDoc = await database.db("tb").collection("wallets").findOne({
            walletNumber: toWallet
        });

        if (!toWalletDoc) {
            return NextResponse.json({error: "Target wallet not found"}, {status: 404});
        }

        // Perform Solana transfer
        let solanaSignature = "";
        try {
            const payer = getTransferKeypair();
            const fromPubkey = new PublicKey(fromWallet);
            const toPubkey = new PublicKey(toWallet);

            // Convert amount to lamports (1 SOL = 1 billion lamports)
            const lamports = Math.floor(amount * 1_000_000_000);

            // Create transfer instruction
            const instruction = SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports,
            });

            // Create and send transaction
            const transaction = new Transaction().add(instruction);
            const recentBlockhash = await connection.getLatestBlockhash();
            transaction.recentBlockhash = recentBlockhash.blockhash;
            transaction.feePayer = payer.publicKey;

            // Sign and send transaction
            transaction.sign(payer);
            solanaSignature = await connection.sendRawTransaction(transaction.serialize());

            // Confirm transaction
            await connection.confirmTransaction({
                signature: solanaSignature,
                blockhash: recentBlockhash.blockhash,
                lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
            });

        } catch (solanaError) {
            console.error("Solana transfer error:", solanaError);
            return NextResponse.json({error: "Failed to transfer on Solana blockchain"}, {status: 500});
        }

        // Update local wallet balances
        const transactionId = new ObjectId();
        const timestamp = new Date();

        // Deduct from source wallet
        await database.db("tb").collection("wallets").updateOne(
            {walletNumber: fromWallet},
            {$inc: {balance: -amount}}
        );

        // Add to target wallet
        await database.db("tb").collection("wallets").updateOne(
            {walletNumber: toWallet},
            {$inc: {balance: amount}}
        );

        // Record transaction in MongoDB
        await database.db("tb").collection("transactions").insertOne({
            _id: transactionId,
            fromWallet,
            toWallet,
            amount,
            groupId: new ObjectId(groupId),
            userId: session.user.sub,
            description: description || "Wallet transfer",
            timestamp,
            status: "completed",
            solanaSignature,
            solanaNetwork: SOLANA_RPC_URL,
            transactionHash: solanaSignature
        });

        return NextResponse.json({
            success: true,
            transactionId: transactionId.toHexString(),
            solanaSignature,
            message: `Successfully transferred ${amount} SOL from ${fromWallet} to ${toWallet}`
        }, {status: 200});

    } catch (error) {
        console.error("Wallet transfer error:", error);
        return NextResponse.json({error: "Failed to process wallet transfer"}, {status: 500});
    }
}

