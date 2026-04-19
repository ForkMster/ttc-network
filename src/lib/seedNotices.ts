/**
 * Seed Example Notices
 * Run from browser console or import into admin panel.
 * Call: seedExampleNotices()
 */

import {
    collection,
    doc,
    setDoc,
    Timestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = new Proxy({}, { get: (_, p) => (getDb() as any)[p] });

const exampleNotices = [
    {
        college: "Government Teachers' Training College, Dhaka",
        collegeId: "dhaka",
        collegeColor: "#1A56DB",
        authorId: "system",
        title: "📋 ২০২৫-২৬ শিক্ষাবর্ষের ভর্তি বিজ্ঞপ্তি",
        body: "২০২৫-২৬ শিক্ষাবর্ষের বি.এড অনার্স প্রোগ্রামে ভর্তির জন্য আবেদন গ্রহণ শুরু হয়েছে। আগ্রহী শিক্ষার্থীরা ১৫ মার্চ ২০২৬ তারিখের মধ্যে অনলাইনে আবেদন করতে পারবেন। বিস্তারিত জানতে কলেজ ওয়েবসাইট দেখুন।",
        postedBy: "Academic Office",
        programme: "BEdHonours" as const,
        isPinned: true,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-05")),
    },
    {
        college: "Government Teachers' Training College, Feni",
        collegeId: "feni",
        collegeColor: "#E63946",
        authorId: "system",
        title: "🏆 আন্তঃকলেজ বিতর্ক প্রতিযোগিতা ২০২৬",
        body: "আগামী ২০ মার্চ ২০২৬ তারিখে আন্তঃকলেজ বিতর্ক প্রতিযোগিতা অনুষ্ঠিত হবে। প্রতিটি কলেজ থেকে একটি দল অংশগ্রহণ করতে পারবে। নিবন্ধনের শেষ তারিখ ১৫ মার্চ।",
        postedBy: "Debate Club Advisor",
        programme: "Both" as const,
        isPinned: false,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-03")),
    },
    {
        college: "Government Teachers' Training College, Rajshahi",
        collegeId: "rajshahi",
        collegeColor: "#8B5CF6",
        authorId: "system",
        title: "⚠️ জরুরি: পরীক্ষার সময়সূচি পরিবর্তন",
        body: "২০২৫-২৬ শিক্ষাবর্ষের দ্বিতীয় সেমিস্টার পরীক্ষার সময়সূচি পরিবর্তন করা হয়েছে। নতুন তারিখ ১ এপ্রিল ২০২৬ থেকে শুরু হবে। সকল শিক্ষার্থীদের নোটিশ বোর্ড দেখার অনুরোধ করা হচ্ছে।",
        postedBy: "Exam Controller",
        programme: "Both" as const,
        isPinned: true,
        isUrgent: true,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-06")),
    },
    {
        college: "Government Teachers' Training College, Comilla",
        collegeId: "comilla",
        collegeColor: "#10B981",
        authorId: "system",
        title: "📚 লাইব্রেরি নতুন বই সংযোজন",
        body: "কলেজ লাইব্রেরিতে শিক্ষা মনোবিজ্ঞান, পাঠ্যক্রম উন্নয়ন এবং শিক্ষা প্রযুক্তি বিষয়ে ২০০টি নতুন বই সংযোজন করা হয়েছে। শিক্ষার্থীরা লাইব্রেরি কার্ড দেখিয়ে বই সংগ্রহ করতে পারবেন।",
        postedBy: "Librarian",
        programme: "Both" as const,
        isPinned: false,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-01")),
    },
    {
        college: "Government Teachers' Training College, Mymensingh",
        collegeId: "mymensingh",
        collegeColor: "#F59E0B",
        authorId: "system",
        title: "🎓 সমাবর্তন অনুষ্ঠান ২০২৬",
        body: "২০২৪-২৫ ব্যাচের সমাবর্তন অনুষ্ঠান আগামী ২৫ মার্চ ২০২৬ তারিখে অনুষ্ঠিত হবে। সকল স্নাতকদের নিবন্ধন ফরম পূরণ করে জমা দেওয়ার অনুরোধ করা হচ্ছে।",
        postedBy: "Principal Office",
        programme: "BEd" as const,
        isPinned: false,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-02-28")),
    },
    {
        college: "Government Teachers' Training College, Khulna",
        collegeId: "khulna",
        collegeColor: "#06B6D4",
        authorId: "system",
        title: "🖥️ ICT ল্যাব আপগ্রেড বিজ্ঞপ্তি",
        body: "কলেজের ICT ল্যাব আধুনিকায়নের জন্য আগামী ১০-১৫ মার্চ পর্যন্ত বন্ধ থাকবে। শিক্ষার্থীরা এই সময়ে লাইব্রেরির কম্পিউটার ব্যবহার করতে পারবেন।",
        postedBy: "ICT Department",
        programme: "Both" as const,
        isPinned: false,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-04")),
    },
    {
        college: "Government Teachers' Training College, Rangpur",
        collegeId: "rangpur",
        collegeColor: "#EC4899",
        authorId: "system",
        title: "🌸 বার্ষিক সাংস্কৃতিক সপ্তাহ ২০২৬",
        body: "আগামী ১-৭ এপ্রিল ২০২৬ কলেজের বার্ষিক সাংস্কৃতিক সপ্তাহ অনুষ্ঠিত হবে। আবৃত্তি, সঙ্গীত, নাটক, চিত্রাংকন — সকল বিভাগে অংশগ্রহণের জন্য ২০ মার্চের মধ্যে নিবন্ধন করুন।",
        postedBy: "Cultural Club",
        programme: "Both" as const,
        isPinned: false,
        isUrgent: false,
        attachmentUrl: "",
        date: Timestamp.fromDate(new Date("2026-03-02")),
    },
];

export async function seedExampleNotices() {
    const noticesRef = collection(db, "notices");
    let count = 0;

    for (const notice of exampleNotices) {
        const docRef = doc(noticesRef);
        await setDoc(docRef, notice);
        count++;
        console.log(`✅ Seeded notice ${count}: ${notice.title}`);
    }

    console.log(`\n🎉 Done! Seeded ${count} example notices.`);
    return count;
}
