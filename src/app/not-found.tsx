"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

export default function NotFound() {
    const { siteName, siteTagline } = useSiteSettings();
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-bg to-accent/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                {/* 404 number */}
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="text-[8rem] sm:text-[10rem] font-extrabold leading-none"
                    style={{
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </motion.h1>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                        Page Not Found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed">
                        The page you&apos;re looking for doesn&apos;t exist or has been
                        moved. Let&apos;s get you back on track.
                    </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-3 mt-8"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md"
                    >
                        <Home size={16} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => typeof window !== "undefined" && window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </motion.div>

                {/* Decorative text */}
                <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-10">
                    {siteName} — {siteTagline}
                </p>
            </motion.div>
        </div>
    );
}
