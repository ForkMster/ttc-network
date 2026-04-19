import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check, Info, UserPlus, ShieldCheck, ShieldX } from "lucide-react";
import { ReactNode } from "react";

type DialogVariant = "danger" | "warning" | "success" | "info";

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    variant?: DialogVariant;
    icon?: ReactNode;
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    onClose?: () => void;
}

const variantStyles: Record<DialogVariant, { bg: string; iconBg: string; btnBg: string; btnHover: string; shadow: string; icon: ReactNode }> = {
    danger: {
        bg: "bg-red-50 dark:bg-red-500/10 text-red-500",
        iconBg: "bg-red-50 dark:bg-red-500/10",
        btnBg: "bg-red-500",
        btnHover: "hover:bg-red-600",
        shadow: "shadow-red-500/20",
        icon: <AlertTriangle size={24} />,
    },
    warning: {
        bg: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        btnBg: "bg-amber-500",
        btnHover: "hover:bg-amber-600",
        shadow: "shadow-amber-500/20",
        icon: <AlertTriangle size={24} />,
    },
    success: {
        bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        btnBg: "bg-emerald-500",
        btnHover: "hover:bg-emerald-600",
        shadow: "shadow-emerald-500/20",
        icon: <Check size={24} />,
    },
    info: {
        bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        btnBg: "bg-blue-500",
        btnHover: "hover:bg-blue-600",
        shadow: "shadow-blue-500/20",
        icon: <Info size={24} />,
    },
};

export default function ConfirmationDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = true,
    variant,
    icon,
    isLoading = false,
    onConfirm,
    onCancel,
    onClose
}: ConfirmationDialogProps) {
    // Backward compat: derive variant from isDanger if variant not provided
    const resolvedVariant = variant || (isDanger ? "danger" : "warning");
    const styles = variantStyles[resolvedVariant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose || onCancel}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-sm bg-white dark:bg-[#161620] rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-8 text-center">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, type: "spring" }}
                                className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-6 ${styles.bg}`}
                            >
                                {icon || styles.icon}
                            </motion.div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h3>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                                {message}
                            </p>
                        </div>
                        <div className="p-5 bg-gray-50/50 dark:bg-white/5 flex gap-3 border-t border-gray-100 dark:border-white/5">
                            <button
                                disabled={isLoading}
                                onClick={onClose || onCancel}
                                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all border border-gray-100 dark:border-white/5 disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={() => {
                                    onConfirm();
                                }}
                                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest text-white rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${styles.btnBg} ${styles.btnHover} ${styles.shadow} active:scale-95 disabled:opacity-70 disabled:grayscale`}
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/* ─── Toast Notification ─── */

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastNotificationProps {
    show: boolean;
    type: ToastType;
    title: string;
    message: string;
    icon?: ReactNode;
    onClose: () => void;
    autoCloseMs?: number;
}

const toastStyles: Record<ToastType, { border: string; iconBg: string; icon: ReactNode; accent: string }> = {
    success: {
        border: "border-emerald-200 dark:border-emerald-500/30",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
        icon: <Check size={20} />,
        accent: "from-emerald-500/5 to-transparent",
    },
    error: {
        border: "border-red-200 dark:border-red-500/30",
        iconBg: "bg-red-50 dark:bg-red-500/10 text-red-500",
        icon: <AlertTriangle size={20} />,
        accent: "from-red-500/5 to-transparent",
    },
    info: {
        border: "border-blue-200 dark:border-blue-500/30",
        iconBg: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
        icon: <Info size={20} />,
        accent: "from-blue-500/5 to-transparent",
    },
    warning: {
        border: "border-amber-200 dark:border-amber-500/30",
        iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
        icon: <AlertTriangle size={20} />,
        accent: "from-amber-500/5 to-transparent",
    },
};

export function ToastNotification({ show, type, title, message, icon, onClose, autoCloseMs = 4000 }: ToastNotificationProps) {
    // Auto close
    if (show && autoCloseMs > 0) {
        setTimeout(onClose, autoCloseMs);
    }

    const s = toastStyles[type];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90vw] max-w-md"
                >
                    <div className={`bg-white dark:bg-[#1a1a28] rounded-2xl shadow-2xl border ${s.border} overflow-hidden`}>
                        <div className={`bg-gradient-to-r ${s.accent} p-4 flex items-start gap-4`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                                {icon || s.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">{title}</h4>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{message}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {/* Progress bar */}
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
                            className={`h-0.5 origin-left ${type === "success" ? "bg-emerald-500" : type === "error" ? "bg-red-500" : type === "info" ? "bg-blue-500" : "bg-amber-500"}`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
