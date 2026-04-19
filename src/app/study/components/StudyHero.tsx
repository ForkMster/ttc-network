"use client";

import { motion } from "framer-motion";
import { Search, Plus, BookText, Video, Users, Sparkles } from "lucide-react";

interface StudyHeroProps {
    stats: {
        materials: number;
        liveSessions: number;
        members: number;
    };
    onSearchChange: (val: string) => void;
    onShareClick: () => void;
}

export default function StudyHero({ stats, onSearchChange, onShareClick }: StudyHeroProps) {
    return (
        <div className="relative pt-12 pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                        <Sparkles size={14} /> Shared Knowledge Library
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-navy-900 dark:text-white leading-[1.05] mb-8 tracking-tight">
                        Power Up Your <br />
                        <span className="text-primary italic">Learning</span> Journey.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-bold mb-12 leading-relaxed">
                        Access shared materials, attend live prep classes, and collaborate with TTC students across Bangladesh.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
                    {[
                        { icon: BookText, label: "Materials Shared", value: stats.materials, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
                        { icon: Video, label: "Schedules Posted", value: stats.liveSessions, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" },
                        { icon: Users, label: "Colleges Active", value: stats.members, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (i + 1) }}
                            className="bg-white dark:bg-[#1a1b23] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-navy-900/5 flex flex-col items-center group hover:scale-105 transition-transform"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${stat.color} group-hover:rotate-6 transition-transform shadow-sm`}>
                                <stat.icon size={28} />
                            </div>
                            <div className="text-3xl font-black text-navy-900 dark:text-white mb-1">{stat.value}+</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto"
                >
                    <div className="relative w-full md:flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            type="text"
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Find materials or live topics..."
                            className="w-full bg-white dark:bg-[#1a1b23] border-2 border-transparent focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-[2rem] pl-16 pr-8 py-5 text-base font-bold outline-none transition-all shadow-xl shadow-navy-900/5 dark:shadow-none placeholder:text-gray-400"
                        />
                    </div>
                    <button 
                        onClick={onShareClick}
                        className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Share Something
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
