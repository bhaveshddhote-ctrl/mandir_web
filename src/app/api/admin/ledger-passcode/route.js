import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'config.json');
const LEDGER_ROUTE = path.join(process.cwd(), 'src', 'app', 'api', 'ledger', 'route.js');

function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return { ledgerPasscode: 'namah108' };
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8') || '{}');
  } catch { return { ledgerPasscode: 'namah108' }; }
}

function writeConfig(config) {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

// GET current passcode (for admin reference)
export async function GET() {
  const config = readConfig();
  return NextResponse.json({ passcode: config.ledgerPasscode || 'namah108' });
}

// POST /api/admin/ledger-passcode  — change the ledger entry passcode
export async function POST(req) {
  try {
    const { currentPasscode, newPasscode } = await req.json();

    if (!currentPasscode || !newPasscode) {
      return NextResponse.json({ error: 'Dono passcode required hain' }, { status: 400 });
    }
    if (newPasscode.length < 4) {
      return NextResponse.json({ error: 'Passcode kam se kam 4 characters ka hona chahiye' }, { status: 400 });
    }

    const config = readConfig();
    const current = config.ledgerPasscode || 'namah108';

    if (currentPasscode !== current) {
      return NextResponse.json({ error: 'Current passcode galat hai' }, { status: 401 });
    }

    config.ledgerPasscode = newPasscode;
    config.updatedAt = new Date();
    writeConfig(config);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ledger passcode change error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
