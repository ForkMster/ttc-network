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

const admissionStepsData = [
    {
      title: "অনলাইনে প্রাথমিক আবেদন",
      subtitle: "Online Primary Application",
      description: "জাতীয় বিশ্ববিদ্যালয়ের ভর্তি বিষয়ক ওয়েবসাইট (app1.nu.edu.bd) থেকে অনলাইনে প্রাথমিক আবেদন ফরম পূরণ করতে হবে। আবেদন ফি বাবদ ৩০০/৩৫০ টাকা (নির্ধারিত) মোবাইল ব্যাংকিং বা সরাসরি কলেজে জমা দিতে হবে।",
      iconName: "Monitor",
      stepNumber: 1,
      order: 1,
      isVisible: true,
    },
    {
      title: "মেধাতালিকা প্রকাশ",
      subtitle: "Merit List Publication",
      description: "আবেদনকারীদের এসএসসি ও এইচএসসি পরীক্ষার ফলাফলের ভিত্তিতে প্রথম, দ্বিতীয় ও কোটা মেধাতালিকা প্রকাশ করা হবে। এসএমএস বা ওয়েবসাইটের মাধ্যমে ফলাফল জানা যাবে।",
      iconName: "Trophy",
      stepNumber: 2,
      order: 2,
      isVisible: true,
    },
    {
      title: "চূড়ান্ত ভর্তি ফরম পূরণ",
      subtitle: "Final Admission Form",
      description: "মেধাতালিকায় স্থান পেলে অনলাইনে চূড়ান্ত ভর্তি ফরম পূরণ করে প্রিন্ট নিতে হবে। এই ফরমে শিক্ষার্থীর সকল ব্যক্তিগত ও শিক্ষাগত তথ্য নির্ভুলভাবে থাকতে হবে।",
      iconName: "FileCheck",
      stepNumber: 3,
      order: 3,
      isVisible: true,
    },
    {
      title: "কাগজপত্র ও ফি জমাদান",
      subtitle: "Document & Fee Submission",
      description: "চূড়ান্ত ভর্তি ফরম, মূল মার্কশিট, প্রশংসাপত্র, ছবি এবং ভর্তি ফি (প্রায় ৪০০০-৪৫০০ টাকা) সরাসরি কলেজের সংশ্লিষ্ট ডেস্কে জমা দিয়ে ভর্তি নিশ্চিত করতে হবে।",
      iconName: "GraduationCap",
      stepNumber: 4,
      order: 4,
      isVisible: true,
    },
];

const admissionCostsData = [
  { label: "প্রাথমিক আবেদন ফি", amount: "৩০০ - ৩৫০ টাকা", order: 1, isVisible: true, isHighlighted: false },
  { label: "ভর্তি ফি (জাতীয় বিশ্ববিদ্যালয় + কলেজ)", amount: "৩,৫০০ - ৪,০০০ টাকা", order: 2, isVisible: true, isHighlighted: false },
  { label: "সিমিস্টার ফি (প্রতি বছর ২টি)", amount: "২,০০০ - ২,৫০০ টাকা", order: 3, isVisible: true, isHighlighted: false },
  { label: "ফরম পূরণ ফি (প্রতি সিমিস্টার)", amount: "১,৫০০ - ২,০০০ টাকা", order: 4, isVisible: true, isHighlighted: false },
  { label: "৪ বছরের মোট আনুমানিক খরচ", amount: "৩৫,০০০ - ৪২,০০০ টাকা*", order: 5, isVisible: true, isHighlighted: true },
];

async function seed() {
  console.log("Seeding admission data...");
  const batch = db.batch();

  // Settings
  const settingsRef = db.collection("settings").doc("admission");
  batch.set(settingsRef, {
    sectionTitle: "বি.এড (অনার্স) ভর্তি প্রক্রিয়া",
    sectionSubtitle: "সরকারি টিচার্স ট্রেনিং কলেজে ভর্তির সহজ ও পূর্ণাঙ্গ গাইডলাইন",
    costTitle: "খরচের আনুমানিক ধারণা",
    isVisible: true,
    updatedAt: new Date(),
  });

  // Steps
  admissionStepsData.forEach((step) => {
    const docRef = db.collection("admissionSteps").doc();
    batch.set(docRef, {
      ...step,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Costs
  admissionCostsData.forEach((cost) => {
    const docRef = db.collection("admissionCosts").doc();
    batch.set(docRef, {
      ...cost,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  console.log("Seeding complete!");
}

seed().catch(console.error);
