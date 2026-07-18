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

// POST /api/admin/change-password
export async function POST(req) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Sabhi fields required hain' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password kam se kam 6 characters ka hona chahiye' }, { status: 400 });
    }

    const users = readUsers();
    const idx = users.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());

    if (idx === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (users[idx].password !== currentPassword) {
      return NextResponse.json({ error: 'Current password galat hai' }, { status: 401 });
    }

    users[idx].password = newPassword;
    users[idx].updatedAt = new Date();
    writeUsers(users);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
