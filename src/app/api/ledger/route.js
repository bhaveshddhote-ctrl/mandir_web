import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');

function getLedgerPasscode() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return 'namah108';
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8') || '{}');
    return config.ledgerPasscode || 'namah108';
  } catch {
    return 'namah108';
  }
}


// Initial seed data to populate the ledger if it's empty
const seedEntries = [
  {
    date: '2026-07-13',
    type: 'in',
    desc: 'गुरु पूर्णिमा विशेष दान',
    name: 'भक्तगण निमनवाड़ा',
    amount: 51000
  },
  {
    date: '2026-07-14',
    type: 'out',
    desc: 'मठ रंग-रोगन एवं जीर्णोद्धार अग्रिम',
    name: 'गोपाल पेंटर्स',
    amount: 15000
  },
  {
    date: '2026-07-10',
    type: 'in',
    desc: 'भंडारा दान (गुप्ता परिवार)',
    name: 'राम प्रकाश गुप्ता',
    amount: 25000
  },
  {
    date: '2026-07-12',
    type: 'out',
    desc: 'भंडारा सामग्री (सब्जी एवं राशन)',
    name: 'किराना भंडार निमनवाड़ा',
    amount: 8400
  }
];

export async function GET() {
  try {
    let entries = await db.getAll('ledger');
    if (!entries) entries = [];

    // Sort by date descending, then by createdAt descending
    entries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Ledger GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch ledger entries' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { date, type, desc, name, amount, passcode } = await req.json();

    // 1. Validate passcode (dynamic — can be changed from Settings)
    const ADMIN_PASSCODE = getLedgerPasscode();
    if (passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'गलत पासकोड। पुनः प्रयास करें।' }, { status: 401 });
    }

    // 2. Validate input fields
    if (!date || !type || !desc || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'कृपया दिनांक, विवरण एवं सही राशि भरें।' }, { status: 400 });
    }

    // 3. Create entry
    const entryData = {
      date,
      type, // 'in' or 'out'
      desc: desc.trim(),
      name: name ? name.trim() : '',
      amount: Number(amount)
    };

    const result = await db.create('ledger', entryData);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Ledger POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
