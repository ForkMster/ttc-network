"use client";

import React from "react";

export default function StorySkeleton() {
  return (
    <div className="bg-white dark:bg-[#16181c] rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-800 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="space-y-2">
          <div className="w-24 h-3 rounded skeleton-shimmer" />
          <div className="w-32 h-2 rounded skeleton-shimmer opacity-50" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 rounded skeleton-shimmer" />
        <div className="w-full h-4 rounded skeleton-shimmer" />
        <div className="w-2/3 h-4 rounded skeleton-shimmer" />
      </div>
      <div className="pt-4 flex justify-between">
        <div className="w-16 h-6 rounded-full skeleton-shimmer" />
        <div className="w-16 h-6 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
