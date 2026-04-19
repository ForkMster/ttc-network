"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllUsers, FirestoreUser } from "@/lib/firestore";

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<(FirestoreUser & { id: string })[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setLoading(true);
            getAllUsers()
                .then(setUsers)
                .catch(err => console.error("Failed to fetch users for search", err))
                .finally(() => setLoading(false));
                
            // Focus input after modal open animation
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Filter logic
    const filteredUsers = query.trim() ? users.filter(user => {
        const q = query.toLowerCase();
        return (
            user.displayName.toLowerCase().includes(q) ||
            user.username?.toLowerCase().includes(q) ||
            user.college?.toLowerCase().includes(q)
        );
    }).slice(0, 10) : []; // Limit to 10 results

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-2xl bg-white dark:bg-[#1a1b23] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Search Input Header */}
                    <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
                        <Search size={22} className="text-gray-400 ml-2" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search for people, colleges..."
                            className="flex-1 bg-transparent border-none px-4 py-2 text-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 placeholder-gray-400"
                        />
                        {query && (
                            <button onClick={() => setQuery("")} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={18} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 ml-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            <span className="text-xs font-bold px-1">ESC</span>
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
                        {loading && (
                            <div className="flex justify-center p-8 text-primary">
                                <Loader2 size={24} className="animate-spin" />
                            </div>
                        )}

                        {!loading && query && filteredUsers.length === 0 && (
                            <div className="text-center p-12 text-gray-500">
                                <User size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No results found</p>
                                <p className="text-sm mt-1">We couldn&apos;t find any matches for &quot;{query}&quot;</p>
                            </div>
                        )}

                        {!loading && !query && (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                Try searching for someone&apos;s name or username.
                            </div>
                        )}

                        {!loading && filteredUsers.length > 0 && (
                            <div className="space-y-1">
                                {filteredUsers.map(user => (
                                    <Link
                                        key={user.id}
                                        href={`/profile/${user.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold shadow-sm">
                                            {user.photoURL ? (
                                                <Image src={user.photoURL} alt={user.displayName} width={48} height={48} className="object-cover w-full h-full" />
                                            ) : (
                                                user.displayName?.charAt(0).toUpperCase() || "?"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {user.displayName}
                                                </h4>
                                                {user.username && (
                                                    <span className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md truncate">
                                                        @{user.username}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="capitalize text-gray-700 dark:text-gray-300 font-semibold">{user.role}</span>
                                                {user.college && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="truncate">{user.college}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors pr-2" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
