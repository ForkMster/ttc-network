/**
 * LocationIcons — Custom SVG district/division map silhouettes
 * =============================================================
 * Each location gets its OWN geographic outline:
 *   - "All Colleges" → Full Bangladesh country silhouette
 *   - "Feni" → Feni district silhouette
 *   - "Dhaka" → Dhaka district silhouette
 *   - etc.
 *
 * Style: Minimal monoline, rounded edges, subtle gradients (blue→teal).
 * Supports light/dark mode with glow effects in dark mode.
 */

import React from "react";

/* ─────────────────────────────────────────────────────────
 *  District / Division SVG paths (simplified silhouettes)
 *  viewBox: "0 0 24 24" — each path is scaled to fill the box
 * ───────────────────────────────────────────────────────── */

const LOCATION_PATHS: Record<string, string> = {
    /* Bangladesh — full country silhouette */
    all: "M13.2 2C12.5 2.4 11.8 3.2 11.3 4C10.8 4.8 10 5.3 9.2 5.5C8.2 5.8 7.7 6.6 7.5 7.4C7.2 8.2 6.5 8.8 5.7 9C5 9.3 4.4 9.8 4.1 10.5C3.8 11.1 3.3 11.6 2.7 11.9C2 12.2 1.5 13 1.5 13.7C1.5 14.5 1.8 15.3 2.4 15.9C2.8 16.3 2.9 16.8 2.8 17.4C2.6 18.1 2.8 18.9 3.4 19.4C3.9 19.8 4.1 20.4 4.1 21C4.1 21.6 4.4 22.1 4.9 22.4C5.4 22.7 6.1 22.8 6.6 22.6C7.1 22.4 7.6 22.4 8.1 22.6C8.6 22.9 9.2 22.8 9.7 22.5C10.2 22.2 10.6 21.7 10.8 21C11 20.3 11.6 19.7 12.3 19.5C12.8 19.3 13.2 18.9 13.4 18.3C13.6 17.7 13.5 17 13.1 16.5C12.7 16 12.7 15.3 12.9 14.7C13.2 14 13.7 13.5 14.4 13.3C14.9 13.1 15.3 12.7 15.5 12.1C15.7 11.5 16.2 11 16.8 10.8C17.3 10.5 17.6 9.9 17.6 9.3C17.6 8.7 17.3 8 16.8 7.6C16.4 7.2 16.2 6.6 16.3 5.9C16.4 5.2 16.2 4.4 15.5 3.9C15 3.4 14.3 2.8 13.7 2.5L13.2 2Z",

    /* Feni — compact southeastern district, roughly diamond-shaped */
    feni: "M12 3C10.5 4 8.5 5.5 7.5 7.5C6.8 9 6.5 10.5 7 12C7.5 13.5 8 15 9 16.5C10 18 11 19.5 12 20.5C13 19.5 14 18 15 16.5C16 15 16.5 13.5 17 12C17.5 10.5 17.2 9 16.5 7.5C15.5 5.5 13.5 4 12 3ZM12 6C13.5 6.8 14.5 8.5 14.8 10C15 11 14.8 12 14 13.2C13.2 14.5 12.5 15.5 12 16C11.5 15.5 10.8 14.5 10 13.2C9.2 12 9 11 9.2 10C9.5 8.5 10.5 6.8 12 6Z",

    /* Dhaka — central Bangladesh, irregular blob */
    dhaka: "M10 2.5C8.5 3 7 4 6 5.5C5 7 4.5 8.5 4.5 10C4.5 11.5 5 13 5.5 14C6 15 6.5 16 7.5 17C8.5 18 9.5 19 10.5 19.8C11.2 20.3 12 21 12.5 21.5C13.2 21 14 20.2 15 19.2C16 18.2 17 17 17.8 15.5C18.5 14 19 12.5 19 11C19 9.5 18.5 8 17.5 6.5C16.5 5 15 3.5 13.5 2.8C12.5 2.3 11 2.2 10 2.5ZM12 6C13.8 6.5 15.2 8 16 9.8C16.5 11 16.5 12.2 16 13.5C15.3 15 14.2 16.5 13 17.5C12.5 17.9 12 18.2 11.5 17.8C10.5 17 9.5 15.8 8.8 14.5C8 13 7.5 11.5 7.8 10C8 8.5 9 7 10.5 6.2C11 6 11.5 5.8 12 6Z",

    /* Rajshahi — northwestern, wider horizontally */
    rajshahi: "M4 7C3 8.5 2.5 10 3 11.5C3.5 13 4.5 14 6 15C7.5 16 9 16.5 11 17C13 17.5 15 17 17 16C18.5 15 19.8 13.5 20.5 12C21 10.5 21 9 20 7.5C19 6 17.5 5 16 4.5C14.5 4 13 3.8 11 4C9 4.2 7 5 5.5 6C5 6.3 4.5 6.5 4 7ZM11.5 7C13.5 7 15.5 7.5 17 8.5C18 9.2 18.5 10.2 18.2 11.2C17.8 12.5 16.8 13.5 15.5 14C14 14.5 12.5 14.5 11 14.2C9.5 13.8 8 13 7 12C6.2 11 5.8 10 6.2 9C6.5 8 7.5 7.2 9 7C9.8 7 10.5 7 11.5 7Z",

    /* Cumilla — eastern, elongated vertically */
    cumilla: "M11 2.5C9.5 3 8.5 4.5 8 6C7.5 7.5 7 9 7 10.5C7 12 7.2 13.5 7.8 15C8.5 16.5 9.2 18 10.2 19C11 20 11.8 20.8 12 21.5C12.5 20.5 13.2 19.5 14 18.2C15 16.5 15.8 15 16.2 13.5C16.5 12 16.8 10.5 16.5 9C16.2 7.5 15.5 6 14.5 4.5C13.5 3.2 12.5 2.5 11 2.5ZM12 6C13 6.5 13.8 7.5 14.2 9C14.5 10 14.5 11.2 14 12.5C13.5 14 12.8 15.5 12 16.8C11.2 15.5 10.5 14 10 12.5C9.5 11 9.5 10 9.8 9C10.2 7.5 11 6.5 12 6Z",

    /* Chattagram (Chittagong) — southeastern coastal, long and narrow */
    chattagram: "M13 1.5C11.5 2 10.5 3.5 10 5C9.5 6.5 9 8 9 10C9 12 9.5 14 10 15.5C10.5 17 11 18.5 11.5 20C12 21.2 12.5 22 13 22.5C13.5 22 14 21 14.5 19.5C15 18 15.5 16.5 15.8 15C16 13.5 16 12 15.8 10.5C15.5 9 15 7.5 14.5 6C14 4.5 13.5 3 13 1.5ZM12.5 6C13.2 7.5 13.5 9 13.8 10.5C14 12 13.8 13.5 13.5 15C13.2 16 12.8 17 12.5 18C12 17 11.5 16 11.2 14.8C10.8 13.5 10.5 12 10.5 10.5C10.5 9 10.8 7.5 11.2 6.5C11.5 6 12 5.5 12.5 6Z",

    /* Sylhet — northeastern, wider top */
    sylhet: "M6 6C5 7.5 4.5 9 5 10.5C5.5 12 6.5 13 8 14C9 14.5 10 15 11.5 15.2C12.5 15.5 14 15.5 15.5 15C17 14.5 18 13.5 19 12C19.8 10.5 20 9 19.5 7.5C19 6 18 5 16.5 4.2C15 3.5 13.5 3.2 12 3.5C10.5 3.8 9 4.5 7.5 5.2C7 5.5 6.5 5.8 6 6ZM12 6.5C13.5 6.5 15 7 16 7.8C16.8 8.5 17 9.5 16.8 10.5C16.5 11.5 15.5 12.5 14.2 13C13 13.5 11.5 13.2 10.2 12.5C9 12 8 11 7.5 10C7 9 7.2 8 8 7.2C9 6.5 10.5 6.2 12 6.5Z",

    /* Rangpur — northern Bangladesh, wider shape */
    rangpur: "M5 6.5C4 7.5 3.5 9 3.5 10.5C3.5 12 4 13.5 5 14.5C6 15.5 7.5 16.5 9 17C10.5 17.5 12 17.5 14 17C15.5 16.5 17 15.5 18.5 14C19.5 13 20 11.5 20 10C20 8.5 19.5 7.5 18.5 6.5C17.5 5.5 16 5 14.5 5C13 5 11 5 9.5 5.2C8 5.5 6.5 5.8 5 6.5ZM12 7.5C14 7.5 15.5 8 16.5 9C17.2 9.8 17.5 10.8 17 11.8C16.5 12.8 15.5 13.5 14 14C12.5 14.5 11 14.2 9.5 13.5C8.2 12.8 7.2 12 7 10.8C6.5 9.5 7.5 8.5 9 8C10 7.5 11 7.5 12 7.5Z",

    /* Khulna — southwestern, delta region */
    khulna: "M5 5C4 6.5 3.5 8 3.5 10C3.5 12 4 13.5 5 15C6 16.5 7 17.5 8.5 18.5C10 19.5 11.5 20 13 20C14.5 20 16 19.5 17 18.5C18 17.5 19 16 19.5 14.5C20 13 20 11 19.5 9.5C19 8 18 6.5 16.5 5.5C15 4.5 13.5 4 12 4C10.5 4 8 4 6.5 4.5C6 4.5 5.5 4.8 5 5ZM12 7C13.5 7.2 15 8 16 9C16.8 10 17 11 16.8 12.2C16.5 13.5 15.5 14.8 14.2 15.5C13 16.2 11.5 16 10 15.5C8.5 14.8 7.5 13.8 7 12.5C6.5 11 7 9.5 8 8.5C9 7.5 10.5 7 12 7Z",

    /* Mymensingh — north-central, squarish */
    mymensingh: "M6.5 5C5.5 6 5 7.5 5 9C5 10.5 5.5 12 6.5 13.5C7.5 14.8 8.5 16 10 17C11 17.5 12 18 13.5 18C15 18 16.5 17.2 17.5 16C18.5 14.8 19 13 19 11.5C19 10 18.5 8.5 17.5 7C16.5 5.5 15 4.5 13.5 4C12 3.5 10.5 3.5 9 4C8 4.2 7 4.5 6.5 5ZM12 7C13.5 7.2 14.8 8 15.8 9.2C16.5 10.2 16.5 11.5 16 12.5C15.5 13.5 14.5 14.5 13 15C11.8 15.5 10.5 15.2 9.5 14.5C8.5 13.5 7.8 12.2 7.5 11C7.2 9.5 7.8 8.2 9 7.5C10 7 11 7 12 7Z",

    /* Barishal — southern coastal, teardrop shape */
    barishal: "M12 2.5C10.5 3.5 9 5 8 7C7 9 6.5 11 6.5 13C6.5 15 7 16.5 8 18C9 19.5 10 20.5 11.5 21.2C12 21.5 12.5 21.5 13 21.2C14 20.5 15.5 19 16.5 17.5C17.5 16 18 14.2 17.8 12.5C17.5 10.5 17 9 16 7C15 5 13.5 3.5 12 2.5ZM12 7C13.2 8 14.2 9.5 14.8 11.2C15.2 12.5 15 14 14.5 15.2C14 16.5 13 17.5 12 18C11 17.5 10 16.2 9.5 15C9 13.8 8.8 12.5 9.2 11C9.8 9.5 10.8 8 12 7Z",

    /* Jashore — southwestern, compact */
    jashore: "M8 4C6.5 5 5 6.5 4.5 8.5C4 10.5 4.5 12 5.5 13.5C6.5 15 8 16.5 9.5 17.5C11 18.5 12.5 19 14 19C15.5 19 17 18 18.2 16.5C19.2 15 19.8 13 19.5 11C19.2 9 18 7 16.5 5.5C15 4 13 3.5 11.5 3.5C10 3.5 9 3.5 8 4ZM12 7C13.5 7.2 15 8 15.8 9.5C16.5 10.8 16.5 12.2 15.8 13.5C15 14.8 13.5 15.8 12 16C10.5 16 9 15.2 8.2 14C7.5 12.5 7.2 11 7.8 9.5C8.5 8 10 7 12 7Z",

    /* Faridpur — central, rounded */
    faridpur: "M10 3.5C8.5 4 7 5.5 6 7C5 8.5 4.5 10 5 12C5.5 13.5 6.5 15 7.5 16C8.5 17 10 18 11.5 18.5C13 19 14.5 19 16 18.2C17.2 17.5 18.5 16 19 14.5C19.5 13 19.5 11.5 19 10C18.5 8.5 17.5 7 16 5.5C14.5 4 13 3.2 11.5 3C10.8 3 10.5 3.2 10 3.5ZM12 7C13.5 7 15 8 16 9.5C16.5 10.5 16.5 11.8 16 13C15.2 14.2 14 15 12.5 15.5C11 15.8 10 15.2 9 14C8 12.8 7.5 11.5 8 10C8.5 8.5 10 7.2 12 7Z",

    /* Pabna — north-central, wider shape */
    pabna: "M5 7.5C4 8.5 3.5 10 4 11.5C4.5 13 5.5 14 7 15C8.5 16 10 16.5 12 17C14 17 16 16.5 17.5 15.5C19 14.5 20 13 20.5 11.5C20.8 10 20.5 8.5 19.5 7.5C18.5 6.5 17 5.5 15.5 5C14 4.5 12.5 4.5 11 5C9.5 5.2 7.5 6 6 6.8C5.5 7 5.2 7.2 5 7.5ZM12 7.5C13.5 7.5 15 8 16.2 9C17 9.8 17.2 10.8 16.8 11.8C16.2 12.8 15 13.5 13.5 14C12 14.5 10.5 14 9.2 13.2C8.2 12.5 7.5 11.5 7.5 10.5C7.5 9.5 8.2 8.5 9.5 8C10.2 7.5 11 7.5 12 7.5Z",

    /* Bogura — northern, somewhat square */
    bogura: "M7 4.5C5.5 5.5 4.5 7 4 8.5C3.5 10 3.5 11.5 4.5 13C5.5 14.5 7 15.5 8.5 16.5C10 17.2 12 17.5 14 17C15.5 16.5 17 15.5 18.2 14C19.2 12.5 20 11 20 9.5C20 8 19 6.5 17.5 5.5C16 4.5 14.5 4 13 3.8C11.5 3.5 10 3.5 8.5 4C8 4.2 7.5 4.2 7 4.5ZM12 7C13.5 7 15 7.8 16 9C16.8 10 16.8 11.2 16 12.5C15.2 13.5 14 14.2 12.5 14.5C11 14.5 9.5 14 8.5 13C7.5 12 7 10.8 7.5 9.5C8 8 9.5 7 11 7C11.3 7 11.7 7 12 7Z",
};

/* ─── Gradient constants ─── */
const G_ACTIVE = "loc-grad-active";
const G_IDLE   = "loc-grad-idle";
const G_GLOW   = "loc-glow";

interface LocationIconProps {
    locationId: string;
    isActive?: boolean;
    size?: number;
    className?: string;
}

export function LocationIcon({ locationId, isActive = false, size = 18, className = "" }: LocationIconProps) {
    const uid = `loc-${locationId}-${isActive ? "a" : "i"}`;
    const path = LOCATION_PATHS[locationId] || LOCATION_PATHS.all;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`location-icon ${isActive ? "location-icon--active" : "location-icon--idle"} ${className}`}
            aria-hidden="true"
        >
            <defs>
                {/* Active gradient: blue → sky → teal */}
                <linearGradient id={`${G_ACTIVE}-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a73e8" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>

                {/* Idle gradient: subtle gray */}
                <linearGradient id={`${G_IDLE}-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--loc-icon-idle-start, #94a3b8)" />
                    <stop offset="100%" stopColor="var(--loc-icon-idle-end, #64748b)" />
                </linearGradient>

                {/* Active glow filter */}
                <filter id={`${G_GLOW}-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* District / country silhouette */}
            <path
                d={path}
                stroke={isActive ? `url(#${G_ACTIVE}-${uid})` : `url(#${G_IDLE}-${uid})`}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isActive ? `url(#${G_ACTIVE}-${uid})` : `url(#${G_IDLE}-${uid})`}
                fillOpacity={isActive ? 0.18 : 0.08}
                filter={isActive ? `url(#${G_GLOW}-${uid})` : undefined}
            />
        </svg>
    );
}

/**
 * LocationFilterButton — Complete filter button with district map icon
 */
interface LocationFilterButtonProps {
    locationId: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export function LocationFilterButton({ locationId, label, isActive, onClick }: LocationFilterButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`location-filter-btn ${isActive ? "location-filter-btn--active" : ""}`}
            aria-pressed={isActive}
        >
            <LocationIcon locationId={locationId} isActive={isActive} size={18} />
            <span className="location-filter-btn__label">{label}</span>
        </button>
    );
}
