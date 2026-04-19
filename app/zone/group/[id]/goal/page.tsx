"use client"
import {useGroup} from "@/lib/hook/use-group";
import {useUser} from "@/lib/hook/use-user";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";

export default function Page() {
    const group = useGroup();
    const user = useUser();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [recurrencePeriod, setRecurrencePeriod] = useState("monthly");
    const [value, setValue] = useState("");

    async function handleSubmit() {
        if (!name || !value) return;

        setSubmitting(true);
        try {
            const response = await fetch("/api/intent/create", {
                method: "POST",
                body: JSON.stringify({
                    type: "GOAL",
                    group: group._id,
                    name: name,
                    vendor: "",
                    date: new Date().toISOString(),
                    photo: null,
                    value: parseFloat(value),
                    paid: false,
                    currency: "€",
                    recurrencePeriod: recurrencePeriod,
                    shares: group.users.map(u => ({ user: u._id, value: 0 }))
                })
            });

            if (response.ok) {
                router.back();
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ background: "#000", width: "100%", minHeight: "100vh", color: "#fff", fontFamily: "'Manrope', sans-serif" }}>
            {/* Header */}
            <div className={"fixed w-full z-10"}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }} className={"px-[24px]"}>
                    <Link href={`/zone/group/${group._id}`}><ArrowLeft className={"size-5"}/></Link>
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.28px" }}>New Intent</span>
                    <div className={"size-5"}/>
                </div>
            </div>

            {/* Form */}
            <div style={{ paddingTop: 100, paddingLeft: 24, paddingRight: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                    {/* Name Field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px" }}>
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Monthly subscription"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 400,
                                letterSpacing: "-0.32px",
                                outline: "none",
                                paddingBottom: 8,
                                fontFamily: "'Manrope', sans-serif",
                            }}
                        />
                    </div>

                    {/* Recurrence Period Field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px" }}>
                            Recurrence Period
                        </label>
                        <select
                            value={recurrencePeriod}
                            onChange={e => setRecurrencePeriod(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 400,
                                letterSpacing: "-0.32px",
                                outline: "none",
                                paddingBottom: 8,
                                fontFamily: "'Manrope', sans-serif",
                                cursor: "pointer",
                            }}
                        >
                            <option style={{ background: "#000" }} value="weekly">Weekly</option>
                            <option style={{ background: "#000" }} value="monthly">Monthly</option>
                            <option style={{ background: "#000" }} value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* Value Field */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px" }}>
                            Value (EUR)
                        </label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 400,
                                letterSpacing: "-0.32px",
                                outline: "none",
                                paddingBottom: 8,
                                fontFamily: "'Manrope', sans-serif",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px" }}>
                            Initiation
                        </label>
                        <input
                            type="date"
                            placeholder="0.00"
                            value={new Date().toISOString().split("T")[0]}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                                color: "#fff",
                                fontSize: 16,
                                fontWeight: 400,
                                letterSpacing: "-0.32px",
                                outline: "none",
                                paddingBottom: 8,
                                fontFamily: "'Manrope', sans-serif",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className={"fixed bottom-8 left-0 w-full px-7"}>
                <Button
                    variant={"secondary"}
                    size={"bl"}
                    onClick={handleSubmit}
                    disabled={!name || !value || submitting}
                >
                    {submitting ? "Please wait..." : "Create Goal"}
                </Button>
            </div>
        </div>
    );
}