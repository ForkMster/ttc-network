"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("TTC Network Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-bg to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* Error icon */}
                <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 mx-auto flex items-center justify-center mb-6">
                    <AlertTriangle size={36} className="text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Something Went Wrong
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 leading-relaxed">
                    An unexpected error occurred. This might be a temporary
                    issue. Please try again.
                </p>

                {/* Error details (dev only) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 text-left">
                        <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-all shadow-md"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <Home size={16} />
                        Go Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
