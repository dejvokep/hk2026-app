"use client"
import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUser} from "@/lib/hook/use-user";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Group} from "@/lib/types";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import ExclamationMark from "@/components/home/exclamation-mark";
import {SWRFacade} from "@/components/swr-facade";
import Expenses, {ExpensesType} from "@/components/expenses";

interface BalanceItem {
    title: string;
    amount: string;
    badge?: {
        variant: string;
        label: string;
    };
}

function StatusBadge({variant, children}: {variant: string, children: string}) {
    const color = variant === "past_due" ? "#bf3333"
        : variant === "due" ? "#d4c45a"
            : "#10b981";

    return (
        <div style={{display: "flex", alignItems: "center", gap: 6, color: color}}>
            <ExclamationMark/>
            <span style={{
                fontSize: 12,
                fontWeight: 500,
                color,
                lineHeight: 1,
                whiteSpace: "nowrap",
            }}>
                {children}
            </span>
        </div>
    );
}

function Divider() {
    return <div style={{height: 1, background: "rgba(255,255,255,0.08)", width: "100%"}}/>;
}

function BalanceCard({label, total, items}: {label: string, total: string, items: BalanceItem[]}) {
    return (
        <div style={{
            width: "100%",
            maxWidth: 365,
            padding: 20,
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 18,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflow: "hidden",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "-0.32px",
                whiteSpace: "nowrap",
            }}>
                <span>{label}</span>
                <span>{total}</span>
            </div>

            <Divider/>

            {items.map((item, i) => (
                <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                        <span style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: "#fff",
                            letterSpacing: "-0.32px",
                            whiteSpace: "nowrap",
                        }}>
                            {item.title}
                        </span>
                    </div>

                    <div style={{display: "flex", alignItems: "center", gap: 14}}>
                        {item.badge && (
                            <StatusBadge variant={item.badge.variant}>{item.badge.label}</StatusBadge>
                        )}
                        <span style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: "#fff",
                            letterSpacing: "-0.32px",
                            whiteSpace: "nowrap",
                        }}>
                            {item.amount}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function HistoryRow({name, group, amount}: {name: string, group: string, amount: string}) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            whiteSpace: "nowrap",
        }}>
            <div style={{display: "flex", flexDirection: "column", gap: 2}}>
                <span style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#fff",
                    letterSpacing: "-0.32px",
                }}>
                    {name}
                </span>
                <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#a4a6b3",
                    letterSpacing: "-0.24px",
                }}>
                    {group}
                </span>
            </div>
            <span style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "-0.32px",
            }}>
                {amount}
            </span>
        </div>
    );
}

function SwipeToSettle({onComplete}: {onComplete: () => void}) {
    const [dragX, setDragX] = useState(0);
    const [complete, setComplete] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const handlePointerDown = () => {
        if (complete) return;
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const handleSize = 45;
        const padding = 4;
        const maxX = rect.width - handleSize - padding * 2;

        const update = (clientX: number) => {
            const x = Math.max(0, Math.min(maxX, clientX - rect.left - handleSize / 2));
            setDragX(x);
            if (x >= maxX - 4) {
                setComplete(true);
                setTimeout(onComplete, 400);
            }
        };

        const move = (ev: PointerEvent) => update(ev.clientX);
        const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            if (!complete) setDragX(0);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: 124.921,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
            padding: 9.393,
            overflow: "hidden",
        }}>
            <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0), #000)",
                pointerEvents: "none",
            }}/>

            <div
                ref={trackRef}
                style={{
                    position: "relative",
                    width: 365,
                    height: 53,
                    background: "#0097FA",
                    borderRadius: 8.453,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <span style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#fff",
                    opacity: complete ? 0 : Math.max(0, 1 - dragX / 200),
                    transition: "opacity 0.2s",
                }}>
                    Swipe to settle all
                </span>

                <div
                    onPointerDown={handlePointerDown}
                    style={{
                        position: "absolute",
                        left: 4 + dragX,
                        top: 4,
                        width: 45,
                        height: 45,
                        background: "#000",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: complete ? "default" : "grab",
                        touchAction: "none",
                        transition: dragX === 0 || complete ? "left 0.2s" : "none",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M2 7h10M7.5 2.5L12 7l-4.5 4.5"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    const router = useRouter();
    const user = useUser();
    const {data: groups, isLoading} = useSWRFetch<Group[]>("/group/list");

    const [youOwe, setYouOwe] = useState<number>(0);
    const [youOwed, setYouOwed] = useState<number>(0);
    const [oweItems, setOweItems] = useState<BalanceItem[]>([]);
    const [owedItems, setOwedItems] = useState<BalanceItem[]>([]);

    useEffect(() => {
        if (!groups) return;

        let totalOwe = 0;
        let totalOwed = 0;
        const owe: BalanceItem[] = [];
        const owed: BalanceItem[] = [];

        groups.forEach(group => {
            const remaining = group.remaining || 0;
            const due = group.due || new Date().toISOString();
            const now = new Date();
            const dueDate = new Date(due);
            const isPastDue = dueDate < now;

            if (remaining > 0) {
                totalOwe += remaining;
                owe.push({
                    title: group.name,
                    amount: `${remaining}€`,
                    badge: {
                        variant: isPastDue ? "past_due" : "due",
                        label: isPastDue ? "Past due" : "Due"
                    }
                });
            }

            const contributed = group.contributed || 0;
            if (contributed > 0) {
                totalOwed += contributed;
                owed.push({
                    title: group.name,
                    amount: `${contributed}€`,
                });
            }
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYouOwe(totalOwe);
        setYouOwed(0);
        setOweItems(owe);
        setOwedItems(owed);
    }, [groups]);

    const exp = useSWRFetch<ExpensesType>("/expenses");

    return (
        <div style={{background: "#000", width: "100%", minHeight: "100vh", color: "#fff", fontFamily: "'Manrope', sans-serif", display: "flex", flexDirection: "column"}}>
            {/* Header */}
            <div style={{
                flexShrink: 0,
                background: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 24,
            }}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingLeft: 24, paddingRight: 24, marginBottom: 16}}>
                    <Link href={"/zone"}><ArrowLeft className={"size-5"}/></Link>
                    <span style={{fontSize: 14, fontWeight: 500, letterSpacing: "-0.28px"}}>{user.name}</span>
                    <div className={"size-5"}/>
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 18px",
                paddingBottom: 140,
                display: "flex",
                flexDirection: "column",
                gap: 26,
            }}>
                {isLoading ? (
                    <div style={{textAlign: "center", paddingTop: 40}}>
                        <span style={{color: "#a4a6b3"}}>Loading...</span>
                    </div>
                ) : (
                    <>
                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <span style={{fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px"}}>You owe</span>
                            {oweItems.length > 0 ? (
                                <BalanceCard
                                    label="You owe"
                                    total={`${youOwe}€`}
                                    items={oweItems}
                                />
                            ) : (
                                <div style={{padding: 20, textAlign: "center", color: "#a4a6b3"}}>
                                    Nothing to owe!
                                </div>
                            )}
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <span style={{fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px"}}>You&apos;re owed</span>
                            {owedItems.length > 0 ? (
                                <BalanceCard
                                    label="You&apos;re owed"
                                    total={`${youOwed}€`}
                                    items={owedItems}
                                />
                            ) : (
                                <div style={{padding: 20, textAlign: "center", color: "#a4a6b3"}}>
                                    Nothing owed to you!
                                </div>
                            )}
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <span style={{fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px"}}>Expense tracker</span>
                            <div style={{
                                width: "100%",
                                maxWidth: 365,
                                padding: 20,
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: 18,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                                overflow: "hidden",
                            }}>
                                <SWRFacade res={exp} success={expenses => <Expenses expenses={expenses}/>}/>
                            </div>
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <span style={{fontSize: 14, fontWeight: 500, color: "#a4a6b3", letterSpacing: "-0.28px"}}>Transaction history</span>
                            <div style={{
                                width: "100%",
                                maxWidth: 365,
                                padding: 20,
                                background: "rgba(255, 255, 255, 0.05)",
                                borderRadius: 18,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                                overflow: "hidden",
                            }}>
                                <HistoryRow name="Recent transactions" group="Coming soon" amount="-"/>
                                <Divider/>
                                <HistoryRow name="No history yet" group="Start spending" amount="€0"/>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Swipe to settle */}
            {youOwe > 0 && (
                <SwipeToSettle onComplete={() => router.push("/zone")}/>
            )}
        </div>
    );
}