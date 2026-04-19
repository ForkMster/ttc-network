import { doc, getDoc, writeBatch } from "firebase/firestore";
import { getDb } from "@/lib/firebase";

// ═══════════════════════════════════════════════════
//  USERNAME VALIDATION
// ═══════════════════════════════════════════════════

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const RESERVED_USERNAMES = new Set([
    "admin", "administrator", "mod", "moderator", "system",
    "support", "help", "root", "null", "undefined",
    "ttc", "ttcconnect", "ttc_connect",
]);

export interface UsernameValidation {
    valid: boolean;
    error?: string;
}

/**
 * Validate a username string against formatting rules.
 */
export function validateUsername(username: string): UsernameValidation {
    const trimmed = username.trim().toLowerCase();

    if (trimmed.length < USERNAME_MIN) {
        return { valid: false, error: `Must be at least ${USERNAME_MIN} characters` };
    }
    if (trimmed.length > USERNAME_MAX) {
        return { valid: false, error: `Must be ${USERNAME_MAX} characters or less` };
    }
    if (!USERNAME_REGEX.test(trimmed)) {
        return { valid: false, error: "Letters, numbers & underscores only. Must start with a letter" };
    }
    if (trimmed.includes("__")) {
        return { valid: false, error: "No consecutive underscores allowed" };
    }
    if (RESERVED_USERNAMES.has(trimmed)) {
        return { valid: false, error: "This username is reserved" };
    }

    return { valid: true };
}

// ═══════════════════════════════════════════════════
//  FIRESTORE OPERATIONS
// ═══════════════════════════════════════════════════

/**
 * Check if a username is available in Firestore.
 * Uses the `usernames` collection where doc ID = username.
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
    const trimmed = username.trim().toLowerCase();
    const db = getDb();
    const usernameDoc = await getDoc(doc(db, "usernames", trimmed));
    return !usernameDoc.exists();
}

/**
 * Claim a username for a user. Uses a batch write to atomically:
 * 1. Create a doc in `usernames/{username}` → { uid }
 * 2. Update `users/{uid}` → { username }
 *
 * If the user already has a username, the old one is released.
 */
export async function claimUsername(
    uid: string,
    newUsername: string,
    oldUsername?: string
): Promise<{ success: boolean; error?: string }> {
    const trimmed = newUsername.trim().toLowerCase();

    // Validate format
    const validation = validateUsername(trimmed);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    // Check availability
    const available = await isUsernameAvailable(trimmed);
    if (!available) {
        return { success: false, error: "Username is already taken" };
    }

    try {
        const db = getDb();
        const batch = writeBatch(db);

        // Release old username if present
        if (oldUsername && oldUsername !== trimmed) {
            batch.delete(doc(db, "usernames", oldUsername.toLowerCase()));
        }

        // Claim new username
        batch.set(doc(db, "usernames", trimmed), { uid });
        batch.update(doc(db, "users", uid), { username: trimmed });

        await batch.commit();
        return { success: true };
    } catch (err) {
        console.error("[username] Failed to claim username:", err);
        return { success: false, error: "Failed to save username. Please try again." };
    }
}
