"use client"
import {useState} from "react";
import {User} from "@/lib/types";
import ProfileIcon from "@/components/profile-icon";
import {ArrowLeft, Save} from "lucide-react";
import {SWRFacade} from "@/components/swr-facade";
import useSWRFetch from "@/lib/hook/use-swr-fetch";
import {Button} from "@/components/ui/button";
import {useUser} from "@/lib/hook/use-user";
import {useRouter} from "next/router";

const avatarColors = {
    DK: { bg: "#6f3a8a", text: "#381146" },
    AJ: { bg: "#4a50a0", text: "#1b1e49" },
    RH: { bg: "#3a8040", text: "#0f3f13" },
} as const;

function Avatar({ id }: { id: string }) {
    //const { bg, text } = avatarColors[initials] || { bg: "#333", text: "#fff" };
    return <ProfileIcon id={id} size={"sm"}/>
}

function ContactCard({ user }: { user: User }) {
    return (
        <div
            style={{
                background: "#16151a",
                borderRadius: 18,
                padding: 20,
                width: 130,
                height: 130,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                overflow: "hidden",
            }}
        >
            <Avatar id={user._id} />
            <span
                style={{
                    fontSize: 20,
                    fontWeight: 500,           // Medium per Figma
                    letterSpacing: "-0.4px",
                    color: "#fff",
                    lineHeight: "normal",
                }}
            >
        {user.name}
      </span>
        </div>
    );
}

function QRIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="10" height="10" rx="1.5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <rect x="6.5" y="6.5" width="5" height="5" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="18" y="4" width="10" height="10" rx="1.5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <rect x="20.5" y="6.5" width="5" height="5" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="4" y="18" width="10" height="10" rx="1.5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <rect x="6.5" y="20.5" width="5" height="5" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="18" y="18" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="23" y="18" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="18" y="23" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.2)" />
            <rect x="23" y="23" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.2)" />
        </svg>
    );
}

function PasswordIcon() {
    return (
        <svg width="38" height="31" viewBox="0 0 38 31" fill="none">
            <circle cx="9" cy="10" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <circle cx="29" cy="10" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <circle cx="19" cy="10" r="5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <line x1="9" y1="16" x2="9" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="16" x2="19" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="29" y1="16" x2="29" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

const styles = {
    screen: {
        background: "#000",
        width: 402,
        minHeight: "100vh",
        position: "relative" as const,
        color: "#fff",
        fontFamily: "'Manrope', sans-serif",
        overflowX: "hidden",
        marginBottom: "100px"
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 24,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 500,               // Medium
        letterSpacing: "-0.28px",
        lineHeight: "normal",
    },
    groupNameSection: {
        position: "absolute" as const,
        top: 108.8,
        left: 30,
        display: "flex",
        flexDirection: "column" as const,
        gap: 6,
        width: 200,
        lineHeight: "normal",
    },
    label: {
        fontSize: 16,
        fontWeight: 500,               // Medium
        letterSpacing: "-0.32px",
        color: "#a4a6b3",
    },
    groupNameValue: {
        fontSize: 24,
        fontWeight: 400,               // Regular
        letterSpacing: "-0.48px",
        color: "rgba(255,255,255,0.5)",
    },
    // no divider
    sectionWrap: {
        display: "flex",
        flexDirection: "column" as const,
        gap: 13,
    },
    sectionHeader: {
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: 500,               // Medium
        letterSpacing: "-0.32px",
        color: "#fff",
        lineHeight: "normal",
        whiteSpace: "nowrap",
    },
    quickInviteWrap: {
        position: "absolute" as const,
        top: 235.5,
        left: 20,
        width: 364,
    },
    cardsRow: {
        display: "flex",
        gap: 20,
        overflowX: "auto" as const,
        scrollbarWidth: "none",
    },
    inviteWrap: {
        position: "absolute" as const,
        top: 461.5,
        left: 20,
        width: 365,
    },
    inviteCardHalf: {
        background: "#16151a",
        borderRadius: 18,
        padding: 20,
        width: 172.5,
        height: 190,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        alignItems: "flex-start",
        overflow: "hidden",
    },
    inviteCardTitle: {
        fontSize: 24,
        fontWeight: 500,               // Medium
        letterSpacing: "-0.48px",
        lineHeight: "normal",
        color: "#fff",
    },
    inviteCardFull: {
        background: "#16151a",
        borderRadius: 18,
        padding: 20,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 16,
        fontWeight: 500,               // Medium
        letterSpacing: "-0.32px",
        lineHeight: "normal",
        color: "#fff",
        whiteSpace: "nowrap",
        overflow: "hidden",
    },
    inviteSubtext: {
        opacity: 0.2,
        fontSize: 16,
        fontWeight: 500,
    },
} as const;

export default function NewGroup() {
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const user = useUser();
    const router = useRouter();

    function create() {
        fetch("/api/group/create", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                remaining: 10,
                due: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
                users: [user.sub]
            })
        }).then(res => res.json()).then(id => router.push(`/zone/group/${id}`)).finally(() => setSubmitting(false))
    }

    return (
        <div style={styles.screen}>
            {/* Header */}
            <div className={"fixed w-full"}>
                <div style={styles.header} className={"px-[24px]"}>
                    <ArrowLeft className={"size-5 text-ligr"}/>
                    <span style={styles.headerTitle}>{name || "Unnamed group"}</span>
                    <Save className={"size-5 text-transparent"}/>
                </div>
            </div>

            {/* Group name */}
            <div style={styles.groupNameSection}>
                <span style={styles.label}>Group name</span>
                <input style={styles.groupNameValue} placeholder={"Shared finances"} value={name} onChange={e => setName(e.target.value)}/>
            </div>

            {/* Quick invite */}
            <div style={styles.quickInviteWrap}>
                <div style={styles.sectionWrap}>
                    <div style={styles.sectionHeader}>
                        Quick invite <span style={{ opacity: 0.5 }}>&gt;</span>
                    </div>
                    <SWRFacade res={useSWRFetch<User[]>("/user/list")} success={users => <div style={styles.cardsRow}>{users.map((c, i) => (
                        <ContactCard key={i} user={c} />
                    ))}</div>}/>
                </div>
            </div>

            {/* Invite people */}
            <div style={styles.inviteWrap}>
                <div style={styles.sectionWrap}>
                    <div style={styles.sectionHeader}>Invite people</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={styles.inviteCardHalf}>
                                <span style={styles.inviteCardTitle}>QR Code</span>
                                <QRIcon />
                            </div>
                            <div style={styles.inviteCardHalf}>
                                <span style={styles.inviteCardTitle}>Invite code</span>
                                <PasswordIcon />
                            </div>
                        </div>
                        <div style={styles.inviteCardFull}>
                            <span>Via email</span>
                            <span style={styles.inviteSubtext}>@</span>
                        </div>
                        <div style={styles.inviteCardFull}>
                            <span>Phone number</span>
                            <span style={styles.inviteSubtext}>#</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"fixed bottom-8 left-0 w-full px-7"}>
                <Button variant={"secondary"} onClick={create}>{submitting ? "Please wait..." : "Create & Add"}</Button>
            </div>
        </div>
    );
}