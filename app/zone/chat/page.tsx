"use client"
import {useState, useRef, useEffect} from "react";
import {ArrowLeft, Send} from "lucide-react";
import Link from "next/link";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function Page() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: userMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#000", width: "100%", minHeight: "100vh", color: "#fff", fontFamily: "'Manrope', sans-serif", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div className={"fixed w-full z-10 top-0"}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24, background: "#000" }} className={"px-[24px] pb-4"}>
                    <Link href={"/zone"}><ArrowLeft className={"size-5"}/></Link>
                    <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.28px" }}>Chat Assistant</span>
                    <div className={"size-5"}/>
                </div>
            </div>

            {/* Messages Container */}
            <div style={{ flex: 1, overflowY: "auto", paddingTop: 80, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: "center", marginTop: 40 }}>
                            <span style={{ color: "#a4a6b3", fontSize: 14 }}>Start a conversation about your groups and expenses</span>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                            <div
                                style={{
                                    maxWidth: "80%",
                                    padding: 12,
                                    borderRadius: 12,
                                    background: msg.role === "user" ? "#0097FA" : "rgba(255, 255, 255, 0.05)",
                                    color: msg.role === "user" ? "#fff" : "#fff",
                                    fontSize: 14,
                                    lineHeight: 1.4,
                                    wordWrap: "break-word",
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <div style={{ padding: 12, borderRadius: 12, background: "rgba(255, 255, 255, 0.05)" }}>
                                <span style={{ color: "#a4a6b3", fontSize: 12 }}>Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Container */}
            <div className={"fixed bottom-0 left-0 w-full"} style={{ background: "#000", paddingBottom: 16 }}>
                <div className={"px-[24px]"} style={{ paddingTop: 16 }}>
                    <div style={{ display: "flex", gap: 12 }} className={"items-center"}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={loading}
                            style={{
                                height: 48,
                                flex: 1,
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: 12,
                                padding: 12,
                                color: "#fff",
                                fontSize: 14,
                                fontFamily: "'Manrope', sans-serif",
                                outline: "none",
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading || !input.trim()}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                background: (loading || !input.trim()) ? "rgba(0, 151, 250, 0.3)" : "#0097FA",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
                                color: "#fff",
                            }}
                        >
                            <Send className={"size-5"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}