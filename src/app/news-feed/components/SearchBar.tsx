"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter posts real-time
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleClear = () => {
        setQuery("");
        onSearch("");
        if (window.innerWidth < 1024) {
            setIsExpanded(false);
        }
    };

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    return (
        <div className="relative flex items-center justify-end w-full lg:w-[280px]">
            {/* Desktop View */}
            <div className="hidden lg:flex items-center w-full relative group">
                <Search 
                    size={16} 
                    className={`absolute left-4 transition-colors ${query ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} 
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts, events, activities..."
                    className="w-full pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-gray-800 rounded-2xl text-[13px] font-bold outline-none transition-all focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-primary/10 focus:border-primary/20"
                />
                {query && (
                    <button 
                        onClick={handleClear}
                        className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                <AnimatePresence>
                    {!isExpanded ? (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleExpand}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-500 shadow-sm"
                        >
                            <Search size={20} />
                        </motion.button>
                    ) : (
                        <motion.div
                            initial={{ width: 40, opacity: 0 }}
                            animate={{ width: "calc(100vw - 32px)", opacity: 1 }}
                            exit={{ width: 40, opacity: 0 }}
                            className="fixed left-4 right-4 top-4 z-50 flex items-center bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2"
                        >
                            <Search size={16} className="ml-3 text-primary" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm font-bold"
                            />
                            <button 
                                onClick={handleClear}
                                className="p-2 text-gray-400"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
