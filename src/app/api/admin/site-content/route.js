import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'site_content.json');

const defaultContent = {
  hero: {
    eyebrow: "अलख निरंजन",
    title: "श्री गुरु गोरखनाथ मठ",
    sub: "नाथ संप्रदाय की सिद्ध परंपरा — तप, त्याग और भक्ति का पावन स्थल",
    location: "निमनवाड़ा"
  },
  history: {
    eyebrow: "परंपरा",
    title: "मठ का इतिहास",
    p1: "श्री गुरु गोरखनाथ मठ, निमनवाड़ा नाथ संप्रदाय की सिद्ध परंपरा का एक पावन केंद्र है। यहाँ की धूनी वर्षों से अखंड रूप से प्रज्ज्वलित है, जो गुरु परंपरा की निरंतरता और साधना की शक्ति का प्रतीक है।",
    p2: "यहाँ प्रतिवर्ष गुरु पूर्णिमा, महाशिवरात्रि और नाथ जयंती जैसे पावन अवसरों पर विशेष पूजा-अर्चना और भंडारे का आयोजन होता है।"
  },
  festivals: [],
  contact: {
    phone: "+91 98765 43210",
    email: "info@gorakhnathmath.org",
    address: "श्री गुरु गोरखनाथ मठ, ग्राम निमनवाड़ा",
    timing: "प्रातः 5:00 बजे से रात्रि 9:00 बजे तक",
    upiId: "gorakhnathmath@upi"
  }
};

function readContent() {
  try {
    if (!fs.existsSync(CONTENT_FILE)) return defaultContent;
    const data = fs.readFileSync(CONTENT_FILE, 'utf8');
    return JSON.parse(data || '{}');
  } catch (e) {
    return defaultContent;
  }
}

function writeContent(data) {
  if (!fs.existsSync(path.dirname(CONTENT_FILE))) {
    fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const content = readContent();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const current = readContent();
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString()
    };
    writeContent(updated);
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 });
  }
}
