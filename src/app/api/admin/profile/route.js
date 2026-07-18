import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  } catch { return []; }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// POST /api/admin/profile
export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email || !name?.trim()) {
      return NextResponse.json({ error: 'Email aur name required hain' }, { status: 400 });
    }

    const users = readUsers();
    const idx = users.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());

    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users[idx].name = name.trim();
    users[idx].updatedAt = new Date();
    writeUsers(users);

    return NextResponse.json({ success: true, name: users[idx].name });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
