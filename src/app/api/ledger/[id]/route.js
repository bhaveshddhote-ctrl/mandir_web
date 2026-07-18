import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSCODE = 'namah108';

// DELETE /api/ledger/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Try MongoDB first
    try {
      await db.delete('ledger', id);
      return NextResponse.json({ success: true });
    } catch (mongoErr) {
      // Fallback: delete from JSON file
      const filePath = path.join(process.cwd(), 'data', 'ledger.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        let entries = JSON.parse(raw || '[]');
        const before = entries.length;
        entries = entries.filter(e => e._id !== id && String(e._id) !== String(id));
        if (entries.length < before) {
          fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf8');
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Storage not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('DELETE /api/ledger/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/ledger/[id]
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const entry = await db.getById('ledger', id);
    if (!entry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
