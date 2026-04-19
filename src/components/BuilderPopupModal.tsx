"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin, Globe, Mail, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { FirestoreBuilderSettings } from "@/lib/firestore";

interface BuilderPopupModalProps {
    show: boolean;
    onClose: () => void;
    builderSettings: FirestoreBuilderSettings;
}

export default function BuilderPopupModal({ show, onClose, builderSettings }: BuilderPopupModalProps) {
    const [showContactOptions, setShowContactOptions] = useState(false);

    // Prevent interactions inside the modal from bubbling to the overlay
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {show && builderSettings && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 pb-8 relative overflow-hidden"
                        onClick={handleModalClick}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center mt-2">
                            <div className="mb-5 relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 transform -translate-y-2"></div>
                                {builderSettings.imageMode === 'image' && builderSettings.imageUrl ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative z-10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={builderSettings.imageUrl} alt={builderSettings.builderName} className="object-cover w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl relative z-10">
                                        <span className="text-4xl font-extrabold text-white">{builderSettings.imageText || "S"}</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white font-english mb-1">
                                {builderSettings.builderName}
                            </h3>
                            <p className="text-sm text-accent font-semibold mb-2">
                                {builderSettings.builderTitle}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-8">
                                {builderSettings.popupLocation}
                            </p>

                            <div className="w-full space-y-3">
                                {builderSettings.popupLinkedinUrl && (
                                    <a
                                        href={builderSettings.popupLinkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-500/20"
                                    >
                                        <Linkedin size={18} />
                                        Connect on LinkedIn
                                    </a>
                                )}
                                {builderSettings.popupPortfolioUrl && (
                                    <a
                                        href={builderSettings.popupPortfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                    >
                                        <Globe size={18} />
                                        View Portfolio
                                    </a>
                                )}

                                
                                {/* Dynamic Contact Options */}
                                {showContactOptions ? (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="space-y-3 pt-1 border-t border-gray-100 dark:border-gray-800"
                                    >
                                        {builderSettings.popupWhatsappNumber && (
                                            <a
                                                href={`https://wa.me/${builderSettings.popupWhatsappNumber.replace(/\D/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold text-sm transition-colors shadow-md shadow-green-500/20"
                                            >
                                                <MessageCircle size={18} />
                                                Send WhatsApp Message
                                            </a>
                                        )}
                                        {builderSettings.popupContactEmail && (
                                            <a
                                                href={builderSettings.popupContactEmail.startsWith("mailto:") ? builderSettings.popupContactEmail : `mailto:${builderSettings.popupContactEmail}`}
                                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                            >
                                                <Mail size={18} />
                                                Send Email
                                            </a>
                                        )}
                                        <button
                                            onClick={() => setShowContactOptions(false)}
                                            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <ChevronUp size={14} /> Handle Less
                                        </button>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setShowContactOptions(true)}
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                    >
                                        <Mail size={18} />
                                        Contact for Projects
                                        <ChevronDown size={16} className="ml-1 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
