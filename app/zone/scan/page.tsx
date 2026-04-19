"use client"
import {useState} from "react";
import ScannerStage from "@/components/scan/scanner-stage";
import GroupSelectionStage from "@/components/scan/group-selection-stage";
import ReceiptDisplayStage from "@/components/scan/receipt-display-stage";
import ShareStage from "@/components/scan/share-stage";
import CompletionStage from "@/components/scan/completion-stage";
import {Group} from "@/lib/types";

export type ApiReceipt = {name: string, expense: string, vendor: string, currency: string, products: {name: string, price: number}[], total: number}

const defReceipt: ApiReceipt = {"name": "Groceries", expense: "GROCERIES", "vendor":"Albert Česká republika, s.r.o.","currency":"€","products":[{"name":"TENTO TP SEZ 3VR 8R","price":4.11},{"name":"ALB HOUBIČKY 10 KS","price":0.7},{"name":"FINO PYT.COL 60L60KS","price":4.96},{"name":"BIO AVOKÁD.OLEJ250ML","price":5.72},{"name":"ALB MOUKA HLADK.1KG","price":0.53},{"name":"ÚSTRÍC.OMÁČ.300ML","price":2.05},{"name":"DRWITT IMUNO 0,75L","price":0.74},{"name":"GUS LIM.ŠŤÁVA 200ML","price":0.53},{"name":"GUS CI.ŠŤÁVA 200ML","price":0.53},{"name":"GUS VIŠNĚ MR.400G","price":3.29},{"name":"WM KOKOS.MLÉKO 200ML","price":1.23},{"name":"JOG.SELSKÝ BOR.200G","price":0.41},{"name":"JOG.SELSKÝ ČOKO.200G","price":0.41},{"name":"7D CROIS KAK.NÁP.80G","price":0.53},{"name":"ROLKA GOUDA 92G","price":1.31},{"name":">ČOKOROLKA 65G","price":0.7},{"name":"7D.CROISS.CHOCO.70G","price":1.59},{"name":"7D.CROIS.KAK.KOK.80G","price":1.29},{"name":"ALB OREGANO 15G","price":0.37},{"name":"ALB BAZALKA 10G","price":0.57},{"name":"MANDARINKY","price":1.07},{"name":"*CIBULE KUCH. ŽLUTÁ","price":0.67},{"name":"NEKTARINKY","price":1.72},{"name":"BANÁNY","price":1.36},{"name":"POMERANČE","price":0.94},{"name":"POMERANČE","price":0.49},{"name":"MANDARINKY","price":0.25},{"name":"CITRONY","price":0.58},{"name":"ČESNEK","price":0.7},{"name":"*HROZNY BÍLÉ BEZEME","price":3.29}],"total":41.42};

export default function Page() {
    const [receipt, setReceipt] = useState<ApiReceipt | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<Group | null>(null);
    const [share, setShare] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [itemCount, setItemCount] = useState(0);

    const complete = () => {
        setCompleted(true);
        if (!receipt || !selectedGroupId) return;

        const submitReceipt = async () => {
            try {
                // Create a sample intent from the receipt
                const intent = {
                    group: selectedGroupId._id,
                    name: receipt.name,
                    vendor: receipt.vendor,
                    date: new Date().toISOString(),
                    expense: receipt.expense,
                    photo: null,
                    paid: false,
                    value: receipt.total,
                    currency: receipt.currency,
                    type: 'ONETIME',
                    products: receipt.products,
                    shares: receipt.products.map(() => [selectedGroupId.users[0]?._id || '']),
                };

                const response = await fetch('/api/intent/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(intent),
                });

                if (response.ok) {
                    setItemCount(receipt.products.length);
                    setSubmitted(true);
                } else {
                    console.error('Failed to submit receipt:', response.status);
                    setSubmitted(true);
                    setItemCount(receipt.products.length);
                }
            } catch (error) {
                console.error('Error submitting receipt:', error);
                setSubmitted(true);
                setItemCount(receipt.products.length);
            }
        };

        submitReceipt();
    }

    if (!receipt)
        return <ScannerStage setReceipt={setReceipt}/>
    if (!selectedGroupId)
        return <GroupSelectionStage onGroupSelected={setSelectedGroupId}/>
    if (!completed) {
        if (share)
            return <ShareStage receipt={receipt} group={selectedGroupId} sw={() => setShare(false)} onComplete={complete}/>
        return <ReceiptDisplayStage receipt={receipt} group={selectedGroupId} sw={() => setShare(true)} complete={complete}/>
    }
    return <CompletionStage receipt={receipt} group={selectedGroupId} itemCount={itemCount} submitted={submitted}/>

}
