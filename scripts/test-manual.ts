import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

const serviceAccount: ServiceAccount = { projectId, clientEmail, privateKey };
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

async function run() {
    console.log("Creating test phase...");
    const phaseRef = db.collection("supportPhases").doc("test-phase-1");
    await phaseRef.set({
        title: "Community Growth Phase",
        description: "Focusing on bringing in the first 1000 active TTCians.",
        status: "In Progress",
        color: "amber",
        icon: "Star",
        order: 1,
        targetAmount: 50000,
        currentAmount: 9999
    });

    console.log("Creating manual contributor...");
    const giftRef = db.collection("gifts").doc();
    await giftRef.set({
        userId: "anonymous",
        collegeId: "admin",
        name: "Satoshi Nakamoto",
        amount: 9999,
        txId: "MANUAL-TEST",
        method: "bKash",
        status: "approved",
        badgeIssued: true,
        date: FieldValue.serverTimestamp(),
        phaseId: phaseRef.id,
        role: "patron"
    });

    console.log("Done!");
    process.exit(0);
}

run().catch(console.error);
