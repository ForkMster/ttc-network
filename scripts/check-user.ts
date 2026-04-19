import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(__dirname, "../.env.local") });

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
    console.error("❌ Missing Firebase Admin credentials");
    process.exit(1);
}

const serviceAccount: ServiceAccount = { projectId, clientEmail, privateKey };
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
const auth = getAuth(app);

async function checkUser() {
    console.log("\n🔍 Checking Admin User Status...");
    
    // 1. Find the user in Auth by email (from subagent screenshot)
    const email = "fork.x.master@gmail.com";
    try {
        const authUser = await auth.getUserByEmail(email);
        console.log(`✅ Auth User found: ${authUser.uid} (${authUser.displayName})`);

        // 2. Check the document in /users/{uid}
        const userDoc = await db.collection("users").doc(authUser.uid).get();
        if (userDoc.exists) {
            console.log(`✅ Firestore User document found at /users/${authUser.uid}`);
            console.log("📄 Data:", JSON.stringify(userDoc.data(), null, 2));
            
            // 3. Check for specific issues
            const data = userDoc.data();
            if (data?.role !== "admin" && data?.role !== "super_manager") {
                console.log("⚠️ WRONG ROLE: Role is", data?.role);
            }
        } else {
            console.log(`❌ Firestore User document NOT FOUND at /users/${authUser.uid}`);
            
            // Search by username
            const snap = await db.collection("users").where("displayName", "==", "SAKIB").limit(1).get();
            if (!snap.empty) {
                const found = snap.docs[0];
                console.log(`💡 Found a user named SAKIB with ID: ${found.id}`);
                console.log("📄 Data:", JSON.stringify(found.data(), null, 2));
                console.log(`🚨 ID MISMATCH: Auth UID is ${authUser.uid} but Firestore ID is ${found.id}. This is why rules are failing!`);
            }
        }
    } catch (e: any) {
        console.error("❌ Error:", e.message);
    }
    process.exit(0);
}

checkUser();
