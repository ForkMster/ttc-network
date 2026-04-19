/**
 * Cloudinary Delete API Route
 * ============================
 * Server-side endpoint that deletes an image from Cloudinary
 * by extracting its public_id from the URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                { error: "Cloudinary not configured" },
                { status: 500 }
            );
        }

        const { url } = await request.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
        const publicId = extractPublicId(url);

        if (!publicId) {
            return NextResponse.json({ error: "Could not extract public_id from URL" }, { status: 400 });
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });

        return NextResponse.json({ 
            success: result.result === "ok",
            result: result.result 
        });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Delete failed" },
            { status: 500 }
        );
    }
}

/**
 * Extract Cloudinary public_id from a secure URL.
 * Handles URLs like:
 *   https://res.cloudinary.com/xxx/image/upload/v123/ttc-connect/logos/abc123.jpg
 * Returns: "ttc-connect/logos/abc123"
 */
function extractPublicId(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        
        // Match /image/upload/v{digits}/ pattern
        const uploadMatch = pathname.match(/\/image\/upload\/v\d+\/(.+)$/);
        if (!uploadMatch) return null;

        const pathWithExt = uploadMatch[1];
        // Remove file extension
        const lastDot = pathWithExt.lastIndexOf(".");
        return lastDot > 0 ? pathWithExt.substring(0, lastDot) : pathWithExt;
    } catch {
        return null;
    }
}
