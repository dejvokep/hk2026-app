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
        top: 20,
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

export default function Page() {
    return <main style={styles.screen}>
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
    </main>
}