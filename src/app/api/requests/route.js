import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await db.create('requests', { ...data, status: 'pending' });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create request' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const requests = await db.getAll('requests');
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
