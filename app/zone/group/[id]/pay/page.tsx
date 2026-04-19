"use client"
import {useGroup} from "@/lib/hook/use-group";
import {useState, useRef} from "react";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const paymentMethods = [
    { name: "Apple Pay", image: "/pay/apay.png", id: "apay" },
    { name: "Google Pay", image: "/pay/gpay.png", id: "gpay" },
    { name: "Solana", image: "/pay/sol.png", id: "sol" },
    { name: "Tatra Banka", image: "/pay/tb.png", id: "tb" },
];

export default function Page() {
    const group = useGroup();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [sliderPosition, setSliderPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const router = useRouter();
    const [pending, setPending] = useState<number>(0);

    const handleMouseDown = () => {
        isDraggingRef.current = true;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        if (sliderPosition < 80) {
            setSliderPosition(0);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);

        setSliderPosition(percentage);

        if (percentage >= 90) {
            handlePaymentSubmit();
        }
    };

    const handleTouchStart = () => {
        isDraggingRef.current = true;
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
        if (sliderPosition < 80) {
            setSliderPosition(0);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDraggingRef.current || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);

        setSliderPosition(percentage);

        if (percentage === 100) {
            handlePaymentSubmit();
        }
    };

    const handlePaymentSubmit = async () => {
        if (!selectedMethod || pending) return;
        setPending(1);

        try {
            const response = await fetch("/api/group/pay", {
                method: "POST",
                body: JSON.stringify({
                    group: group._id,
                    method: selectedMethod,
                    amount: group.remaining || 0
                })
            });

            setPending(2);
            setTimeout(() => router.push(`/zone/group/${group._id}`), 2000);
        } catch (error) {
            console.error("Payment failed:", error);
            setSliderPosition(0);
        }
    };

    return (
        <div style={{ background: "#000", width: "100%", minHeight: "100vh", color: "#fff", fontFamily: "'Manrope', sans-serif", paddingBottom: 120 }}>
            {/* Header */}
            <div className={"fixed w-full z-10"}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }} className={"px-[24px]"}>
                    <Link href={`/zone/group/${group._id}`}><ArrowLeft className={"size-5"}/></Link>
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.28px" }}>Payment</span>
                    <div className={"size-5"}/>
                </div>
            </div>

            {/* Amount Title */}
            <div style={{ paddingTop: 80, paddingLeft: 24, paddingRight: 24, marginBottom: 40 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px" }}>Total due</span>
                    <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.72px" }}>
                        {group.remaining ? `${group.remaining}` : "0"}€
                    </span>
                </div>
            </div>

            {/* Payment Methods */}
            <div style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    {paymentMethods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            style={{
                                border: selectedMethod === method.id ? "2px solid #0097FA" : "2px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 16,
                                padding: 16,
                                background: selectedMethod === method.id ? "rgba(0, 151, 250, 0.1)" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                            }}
                        >
                            <span style={{ fontSize: 16, fontWeight: 500, color: selectedMethod === method.id ? "#fff" : "#a4a6b3" }}>
                                {method.name}
                            </span>
                            <div
                                style={{
                                    borderRadius: 12,
                                    width: (method.id === "apay" || method.id === "gpay") ? 80 : undefined,
                                    padding: "7px 5px",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: (method.id === "apay" || method.id === "gpay") ? "#fff" : "transparent",
                                }}
                            >
                                <img
                                    src={method.image}
                                    alt={method.name}
                                    style={{
                                        height: 30,
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Swipe Slider */}
            <div className={"fixed bottom-8 left-0 w-full px-7"}>
                <div
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    style={{
                        background: selectedMethod ? "rgba(0, 151, 250, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(0, 151, 250, 0.5)",
                        borderRadius: 12,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 8,
                        paddingRight: 8,
                        position: "relative",
                        cursor: selectedMethod ? "grab" : "not-allowed",
                        opacity: selectedMethod ? 1 : 0.5,
                        transition: sliderPosition === 0 ? "all 0.3s ease" : "none",
                    }}
                >
                    {/* Slider Background */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${sliderPosition}%`,
                            background: pending === 2 ? "#0DA781" : "rgba(0, 151, 250, 0.3)",
                            borderRadius: 10,
                            transition: sliderPosition === 0 ? "width 0.3s ease" : "none",
                        }}
                    />

                    {/* Slider Handle */}
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            background: pending === 2 ? "#0DA781" : "#0097FA",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: `translateX(${sliderPosition * 2.8}px)`,
                            transition: sliderPosition === 0 ? "transform 0.3s ease" : "none",
                            cursor: selectedMethod ? "grabbing" : "not-allowed",
                            zIndex: 10,
                            flexShrink: 0,
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    {/* Slider Text */}
                    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 5 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.32px", color: "#fff" }}>
                            {pending === 2 ? "Payment processed!" : "Swipe to settle all"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}