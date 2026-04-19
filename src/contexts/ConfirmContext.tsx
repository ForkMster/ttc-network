"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

type DialogVariant = "danger" | "warning" | "success" | "info";

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: DialogVariant;
    icon?: ReactNode;
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    setIsLoading: (loading: boolean) => void;
    close: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<(ConfirmOptions & { resolve: (val: boolean) => void }) | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const confirm = (options: ConfirmOptions) => {
        setIsLoading(false);
        return new Promise<boolean>((resolve) => {
            setConfig({ ...options, resolve });
        });
    };

    const handleConfirm = () => {
        if (config) {
            config.resolve(true);
            // We don't automatically close/unset config here if we want to support isLoading
            // The caller will call close() or setIsLoading(true)
        }
    };

    const handleCancel = () => {
        if (config) {
            config.resolve(false);
            setConfig(null);
            setIsLoading(false);
        }
    };

    const close = () => {
        setConfig(null);
        setIsLoading(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm, setIsLoading, close }}>
            {children}
            <ConfirmationDialog
                isOpen={!!config}
                title={config?.title || ""}
                message={config?.message || ""}
                confirmText={config?.confirmText}
                cancelText={config?.cancelText}
                variant={config?.variant}
                icon={config?.icon}
                isLoading={isLoading}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context;
};
