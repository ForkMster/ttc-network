"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download, Maximize2 } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
    src: string | null;
    alt?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
    if (!src) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/95 backdrop-blur-md p-4 md:p-12"
                    onClick={onClose}
                >
                    {/* Controls */}
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute top-6 right-6 flex items-center gap-4 z-10"
                    >
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(src, '_blank');
                            }}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/10"
                            title="Open Original"
                        >
                            <Maximize2 size={20} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>

                    {/* Image Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-white/5">
                            <Image
                                src={src}
                                alt={alt || "Lightbox Image"}
                                fill
                                className="object-contain"
                                priority
                                unoptimized // To ensure the full resolution is viewable if url is external/proxy
                            />
                        </div>
                        
                        {/* Caption */}
                        {alt && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute -bottom-12 left-0 right-0 text-center"
                            >
                                <span className="text-white/60 text-xs font-black uppercase tracking-widest">{alt}</span>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
