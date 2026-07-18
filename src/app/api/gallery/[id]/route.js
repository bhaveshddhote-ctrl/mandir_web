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
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(data, null, 2), 'utf8');
}

// PATCH /api/gallery/[id] — toggle visibility or update title/caption/order
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const gallery = readGallery();
    const idx = gallery.findIndex(g => g.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Update fields
    if (typeof body.visible !== 'undefined') gallery[idx].visible = body.visible;
    if (typeof body.title !== 'undefined') gallery[idx].title = body.title;
    if (typeof body.caption !== 'undefined') gallery[idx].caption = body.caption;
    if (typeof body.order !== 'undefined') gallery[idx].order = body.order;
    gallery[idx].updatedAt = new Date().toISOString();

    writeGallery(gallery);
    return NextResponse.json({ success: true, item: gallery[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/gallery/[id] — delete image file + metadata
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const gallery = readGallery();
    const idx = gallery.findIndex(g => g.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete actual file
    const filePath = path.join(GALLERY_DIR, gallery[idx].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    gallery.splice(idx, 1);
    writeGallery(gallery);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
