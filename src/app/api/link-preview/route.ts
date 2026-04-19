import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        const domain = targetUrl.hostname.replace('www.', '');

        // 1. Check cache first
        if (adminDb) {
            const cacheRef = adminDb.collection('linkPreviewsCache').doc(encodeURIComponent(targetUrl.href));
            const cachedDoc = await cacheRef.get();
            if (cachedDoc.exists) {
                const data = cachedDoc.data();
                // Cache valid for 7 days
                if (data && data.cachedAt && (Date.now() - data.cachedAt.toMillis() < 7 * 24 * 60 * 60 * 1000)) {
                    return NextResponse.json(data.preview);
                }
            }
        }

        let preview = {
            title: '',
            description: '',
            thumbnail: '',
            domain,
            url: targetUrl.href
        };

        // 2. Platform-specific fast paths
        if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
            const ytRe = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const match = targetUrl.href.match(ytRe);
            if (match && match[1]) {
                const videoId = match[1];
                preview.title = 'YouTube Video'; 
                preview.thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
        } else if (domain.includes('drive.google.com')) {
            preview.title = 'Google Drive File';
            preview.description = 'Shared file from Google Drive';
        }

        // 3. If no fast thumbnail, try scraping HTML
        if (!preview.thumbnail || preview.title === 'YouTube Video') {
            try {
                const response = await axios.get(targetUrl.href, {
                    headers: {
                        'User-Agent': 'TTC-Network-Bot/1.0 (+https://ttcnetwork.web.app/bot)',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
                    },
                    timeout: 8000
                });

                const html = response.data;
                const $ = cheerio.load(html);

                preview.title = $('meta[property="og:title"]').attr('content') || $('title').text() || preview.title;
                preview.description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || preview.description;
                
                const metaImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
                if (metaImage && !preview.thumbnail) {
                    // Ensure absolute URL
                    if (metaImage.startsWith('http')) {
                        preview.thumbnail = metaImage;
                    } else if (metaImage.startsWith('//')) {
                        preview.thumbnail = `https:${metaImage}`;
                    } else {
                        preview.thumbnail = `${targetUrl.protocol}//${targetUrl.host}${metaImage.startsWith('/') ? '' : '/'}${metaImage}`;
                    }
                }
                
                const ogUrl = $('meta[property="og:url"]').attr('content');
                if (ogUrl) {
                    try {
                        preview.domain = new URL(ogUrl).hostname.replace('www.', '');
                    } catch(e) {}
                }
            } catch (fetchError) {
                console.error(`Failed to scrape ${targetUrl.href}:`, fetchError);
                // Continue with whatever we have
            }
        }

        // Format validation
        if (!preview.title) preview.title = domain;
        if (preview.description && preview.description.length > 200) {
            preview.description = preview.description.substring(0, 197) + '...';
        }

        // 4. Save to cache
        if (adminDb) {
            const cacheRef = adminDb.collection('linkPreviewsCache').doc(encodeURIComponent(targetUrl.href));
            await cacheRef.set({
                preview,
                cachedAt: new Date()
            });
        }

        return NextResponse.json(preview);
    } catch (e: any) {
        return NextResponse.json({ error: 'Invalid URL or scraping failed', details: e.message }, { status: 400 });
    }
}
