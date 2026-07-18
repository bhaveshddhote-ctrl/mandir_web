import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Read users directly from JSON file for fast, reliable login
// No MongoDB dependency for authentication
function getUsersFromJson() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Error reading users.json:', e);
    return [];
  }
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email aur password dono zaroori hain.' }, { status: 400 });
    }

    // Check in JSON file first (fast, no DB needed)
    const users = getUsersFromJson();
    const found = users.find(
      u => u.email?.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
    );

    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      return NextResponse.json({ user: userWithoutPassword });
    }

    // Also try MongoDB if available
    try {
      const { db } = await import('@/lib/db');
      const dbUsers = await db.getAll('users', {});
      const dbFound = dbUsers.find(
        u => u.email?.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password
      );
      if (dbFound) {
        const { password: _, ...userWithoutPassword } = dbFound;
        return NextResponse.json({ user: userWithoutPassword });
      }
    } catch (dbErr) {
      // MongoDB not available, that's okay — JSON check already done above
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
