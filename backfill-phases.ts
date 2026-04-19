import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const DEFAULT_NOTES = [
    "This phase took longer than I expected, but watching the platform come alive pixel by pixel made every late night worth it.",
    "The backend is the foundation nobody sees but everyone feels. Getting this right means everything that comes after will actually work.",
    "A mobile app means TTC Network fits in every student's pocket. This phase excites me more than any other.",
    "Going beyond Bangladesh is a dream I didn't dare say out loud at first. Now I believe it's possible.",
    "None of this matters if the community doesn't grow. This phase is about people — and that's what it was always about."
];

async function backfillPhases() {
    console.log("Starting backfill of supportPhases...");
    const snap = await db.collection("supportPhases").orderBy("order", "asc").get();
    let index = 0;
    
    const batch = db.batch();
    
    for (const doc of snap.docs) {
        const data = doc.data();
        
        let newTraction = data.tractionLevel;
        if (newTraction === undefined) {
            newTraction = data.progress !== undefined ? data.progress : 0;
        }

        let newNote = data.founderNote;
        if (!newNote) {
            newNote = DEFAULT_NOTES[index] || DEFAULT_NOTES[0];
        }

        const status = newTraction === 100 ? "Complete" : data.status;

        batch.update(doc.ref, { 
            tractionLevel: newTraction, 
            founderNote: newNote,
            status: status
        });

        console.log(`Updated phase ${doc.id} (Order: ${data.order}) -> traction: ${newTraction}, status: ${status}`);
        index++;
    }

    await batch.commit();
    console.log("Backfill completed successfully.");
}

backfillPhases().catch(console.error);
