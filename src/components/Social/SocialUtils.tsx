"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * RichText Component
 * Highlight hashtags and @mentions
 */
export function RichText({ text, onTagClick }: { text: string; onTagClick?: (tag: string) => void }) {
    if (!text) return null;
    
    // Regex to find hashtags and @mentions
    const parts = text.split(/((?:^|\s)(?:#|@)[\w\u0980-\u09FF]+)/g);
    
    return (
        <>
            {parts.map((part, i) => {
                const isTag = part.trim().startsWith("#");
                const isMention = part.trim().startsWith("@");
                
                if (isTag) {
                    return (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onTagClick?.(part.trim().slice(1));
                            }}
                            className="text-primary font-bold hover:underline"
                        >
                            {part}
                        </button>
                    );
                }
                
                if (isMention) {
                    const username = part.trim().slice(1);
                    return (
                        <Link
                            key={i}
                            href={`/profile/${username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary font-bold hover:underline"
                        >
                            {part}
                        </Link>
                    );
                }
                
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

/**
 * ExpandableText Component
 */
export function ExpandableText({ text, limit = 160, onTagClick }: { text: string; limit?: number; onTagClick?: (tag: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    if (!text) return null;
    const shouldTruncate = text.length > limit;
    const displayText = expanded ? text : text.slice(0, limit);

    return (
        <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            <RichText text={displayText} onTagClick={onTagClick} />
            {shouldTruncate && !expanded && "... "}
            {shouldTruncate && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className="text-primary font-bold hover:underline ml-1 text-sm inline-block"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
}

/**
 * Relative Time Formatter
 */
export function timeAgo(ts: any) {
    if (!ts) return "";
    let date: Date;
    if (ts.toDate) {
        date = ts.toDate();
    } else if (ts.seconds) {
        date = new Date(ts.seconds * 1000);
    } else {
        date = new Date(ts);
    }
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
