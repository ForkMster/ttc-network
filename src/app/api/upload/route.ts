/**
 * Cloudinary Upload API Route
 * ============================
 * Server-side endpoint that receives files from the client
 * and uploads them to Cloudinary. Keeps the API secret secure.
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
        // Check Cloudinary config
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                { error: "Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local" },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folder = formData.get("folder") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type (images only)
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Maximum 10MB." }, { status: 400 });
        }

        // Convert File to base64 data URI for Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const publicId = formData.get("publicId") as string | null;

        // Upload to Cloudinary (with optional overwrite via publicId)
        const uploadOptions: Record<string, any> = {
            folder: folder || "ttc-connect",
            resource_type: "image",
            transformation: [
                { quality: "auto:good" },
                { fetch_format: "auto" },
            ],
        };

        // If publicId is provided, use it to overwrite existing image
        if (publicId) {
            uploadOptions.public_id = publicId;
            uploadOptions.overwrite = true;
            uploadOptions.invalidate = true; // Invalidate CDN cache for the old URL
        }

        const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Upload failed" },
            { status: 500 }
        );
    }
}
