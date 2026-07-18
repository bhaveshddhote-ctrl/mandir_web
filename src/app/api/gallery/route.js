import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GALLERY_JSON = path.join(process.cwd(), 'data', 'gallery.json');
const GALLERY_DIR = path.join(process.cwd(), 'public', 'gallery');

function readGallery() {
  try {
    if (!fs.existsSync(GALLERY_JSON)) return [];
    return JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf8') || '[]');
  } catch { return []; }
}

function writeGallery(data) {
  if (!fs.existsSync(path.dirname(GALLERY_JSON))) {
    fs.mkdirSync(path.dirname(GALLERY_JSON), { recursive: true });
  }
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(data, null, 2), 'utf8');
}

function ensureGalleryDir() {
  if (!fs.existsSync(GALLERY_DIR)) {
    fs.mkdirSync(GALLERY_DIR, { recursive: true });
  }
}

// GET /api/gallery — returns all or only visible images
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const publicOnly = searchParams.get('public') === 'true';
    let items = readGallery();
    if (publicOnly) {
      items = items.filter(i => i.visible);
    }
    // Sort by order field
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

// POST /api/gallery — upload a new image (multipart form data)
export async function POST(req) {
  try {
    ensureGalleryDir();
    const formData = await req.formData();
    const file = formData.get('image');
    const title = formData.get('title') || 'Gallery Image';
    const caption = formData.get('caption') || '';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Image file required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF allowed' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size 5MB se zyada nahi ho sakta' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(GALLERY_DIR, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(bytes));

    // Save to gallery.json
    const gallery = readGallery();
    const newItem = {
      id: `gal_${Date.now()}`,
      filename,
      url: `/gallery/${filename}`,
      title: title.trim(),
      caption: caption.trim(),
      visible: true,
      order: gallery.length,
      uploadedAt: new Date().toISOString(),
    };
    gallery.push(newItem);
    writeGallery(gallery);

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
