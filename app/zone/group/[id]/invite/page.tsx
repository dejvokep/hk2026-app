"use client"
import {useGroup} from "@/lib/hook/use-group";
import {ArrowLeft, X} from "lucide-react";
import Link from "next/link";
import {QRCodeSVG} from "qrcode.react";
import {useRef, useState} from "react";
import {PasswordIcon, QRIcon} from "@/components/new-group";

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
        top: 70,
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
    inviteCode: {
        fontSize: 18,
        fontWeight: 600,
        color: "#0097FA",
        letterSpacing: "-0.36px",
        fontFamily: "monospace",
    },
    copyButton: {
        background: "transparent",
        border: "none",
        color: "#0097FA",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500,
        padding: 0,
        textDecoration: "underline",
    },
    modal: {
        position: "fixed" as const,
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
    },
    modalContent: {
        background: "#16151a",
        borderRadius: "24px 24px 0 0",
        padding: 32,
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: 24,
        width: "100%",
        maxWidth: 402,
        position: "relative" as const,
        animation: "slideUp 0.3s ease-out",
    },
    closeButton: {
        position: "absolute" as const,
        top: 16,
        right: 16,
        background: "transparent",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        padding: 0,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 600,
        color: "#fff",
        marginTop: 16,
    },
} as const;

export default function Page() {
    const group = useGroup();
    const qrRef = useRef<HTMLDivElement>(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);

    const groupId = group._id;
    const inviteCode = groupId.substring(0, 8).toUpperCase();
    const tatraShareUrl = `tatrashare://group/${groupId}`;

    const handleDownloadQR = () => {
        const svg = qrRef.current?.querySelector('svg') as SVGElement;
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${group.name}-invite-qr.png`;
                link.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(inviteCode);
        alert('Invite code copied!');
    };

    return <main style={styles.screen}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }} className={"px-[24px]"}>
            <Link href={`/zone/group/${group._id}`}><ArrowLeft className={"size-5"}/></Link>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.28px" }}>Invite to {group.name}</span>
            <div className={"size-5"}/>
        </div>

        {/* Invite people */}
        <div style={styles.inviteWrap}>
            <div style={styles.sectionWrap}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={styles.inviteCardHalf} onClick={() => setShowQRModal(true)}>
                            <span style={styles.inviteCardTitle}>QR Code</span>
                            <QRIcon />
                        </div>
                        <div style={styles.inviteCardHalf} onClick={() => setShowCodeModal(true)}>
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

        {/* QR Code Modal */}
        {showQRModal && (
            <div style={styles.modal} onClick={() => setShowQRModal(false)}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowQRModal(false)}
                        style={styles.closeButton}
                    >
                        <X className={"size-6"}/>
                    </button>
                    <h2 style={styles.modalTitle}>QR Code</h2>
                    <div ref={qrRef}>
                        <QRCodeSVG
                            value={tatraShareUrl}
                            size={200}
                            level="H"
                            fgColor="#ffffff"
                            bgColor="#000000"
                        />
                    </div>
                    <button
                        onClick={handleDownloadQR}
                        style={{...styles.copyButton, textDecoration: "none", fontSize: 14}}
                    >
                        Download QR Code
                    </button>
                </div>
            </div>
        )}

        {/* Invite Code Modal */}
        {showCodeModal && (
            <div style={styles.modal} onClick={() => setShowCodeModal(false)}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowCodeModal(false)}
                        style={styles.closeButton}
                    >
                        <X className={"size-6"}/>
                    </button>
                    <h2 style={styles.modalTitle}>Invite Code</h2>
                    <code style={{...styles.inviteCode, fontSize: 48, padding: 24, background: "rgba(0, 151, 250, 0.1)", borderRadius: 12}}>
                        {inviteCode}
                    </code>
                    <button
                        onClick={handleCopyCode}
                        style={{...styles.copyButton, textDecoration: "none", fontSize: 14}}
                    >
                        Copy Code
                    </button>
                </div>
            </div>
        )}
    </main>
}