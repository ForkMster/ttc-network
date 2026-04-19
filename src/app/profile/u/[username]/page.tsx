"use client";

/**
 * Username-based Profile Route
 * =============================
 * Renders a user's profile directly at /profile/u/[username]
 * Clean, shareable URL — no redirects.
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, limit, getDocs, doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { Loader2, UserX } from "lucide-react";
import { ProfilePageContent } from "../../[uid]/ProfilePageContent";

export default function UsernameProfilePage() {
    const params = useParams();
    const username = (params.username as string)?.toLowerCase();
    const [resolvedUid, setResolvedUid] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        const lookupUser = async () => {
            try {
                const db = getDb();

                // Fast path: check the usernames collection (created by claimUsername)
                const usernameDocRef = doc(db, "usernames", username);
                const usernameSnap = await getDoc(usernameDocRef);
                if (usernameSnap.exists()) {
                    const data = usernameSnap.data();
                    if (data.uid) {
                        setResolvedUid(data.uid);
                        setLoading(false);
                        return;
                    }
                }

                // Fallback: search users collection by username field
                const q = query(
                    collection(db, "users"),
                    where("username", "==", username),
                    limit(1)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setResolvedUid(snap.docs[0].id);
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Username lookup failed:", err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        lookupUser();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg)" }}>
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Looking up @{username}...
                </p>
            </div>
        );
    }

    if (notFound || !resolvedUid) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg)" }}>
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <UserX size={36} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                    User Not Found
                </h1>
                <p className="text-sm max-w-sm text-center" style={{ color: "var(--text-muted)" }}>
                    No profile found for <strong className="text-accent">@{username}</strong>.
                    The username may have been changed or doesn&apos;t exist.
                </p>
                <a
                    href="/"
                    className="mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all"
                    style={{ background: "var(--btn-primary)" }}
                >
                    Go Home
                </a>
            </div>
        );
    }

    // Render the full profile directly with the resolved UID
    return <ProfilePageContent uidOverride={resolvedUid} />;
}
