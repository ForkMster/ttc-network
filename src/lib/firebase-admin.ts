/**
 * Firebase Admin SDK — Server-Side Only
 * =======================================
 * Used in API routes (Next.js Route Handlers) for
 * server-side operations like session verification.
 *
 * Will NOT crash if env vars are empty — logs a warning
 * instead. Fill in the values before building API routes.
 *
 * ⚠️  NEVER import this file from client components.
 *     Only use in: src/app/api/**, server actions, middleware.
 */

import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminClientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
const adminPrivateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
);
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

/**
 * Whether the Admin SDK has valid credentials.
 * Check this before making admin calls to avoid crashes.
 */
export const isAdminConfigured =
    adminClientEmail.length > 0 &&
    adminPrivateKey.length > 0 &&
    projectId.length > 0;

if (!isAdminConfigured) {
    console.warn(
        "[TTC Network] Firebase Admin SDK not configured.\n" +
        "Fill in FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env.local.\n" +
        "Admin features (session verification, server-side auth) will not work."
    );
}

// Initialize Admin SDK (only once, only if configured)
function initAdmin() {
    if (getApps().length > 0) return getApps()[0];
    if (!isAdminConfigured) return null;

    const serviceAccount: ServiceAccount = {
        projectId,
        clientEmail: adminClientEmail,
        privateKey: adminPrivateKey,
    };

    return initializeApp({ credential: cert(serviceAccount) });
}

const adminApp = initAdmin();

/**
 * Admin Auth — use for session cookie verification.
 * Returns null if Admin SDK is not configured.
 */
export const adminAuth = adminApp ? getAuth(adminApp) : null;

/**
 * Admin Firestore — use for server-side database operations.
 * Returns null if Admin SDK is not configured.
 */
export const adminDb = adminApp ? getFirestore(adminApp) : null;

/**
 * LinkPreview API key.
 * Returns empty string if not configured.
 */
export const linkPreviewApiKey = process.env.LINKPREVIEW_API_KEY || "";
export const isLinkPreviewConfigured = linkPreviewApiKey.length > 0;
