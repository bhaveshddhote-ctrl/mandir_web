import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const CONST_JSON = path.join(process.cwd(), 'data', 'construction.json');

const seedProjects = [
  {
    id: "proj_101",
    title: "मुख्य मंदिर शिखर जीर्णोद्धार (Shikhar Renovation)",
    budget: 500000,
    spent: 320000,
    progress: 64,
    status: "On Track",
    date: "Dec 2026",
    createdAt: new Date().toISOString()
  },
  {
    id: "proj_102",
    title: "अन्नक्षेत्र एवं नवीन रसोई भवन (Pilgrim Kitchen)",
    budget: 800000,
    spent: 450000,
    progress: 56,
    status: "On Track",
    date: "Mar 2027",
    createdAt: new Date().toISOString()
  }
];

function readProjects() {
  try {
    if (!fs.existsSync(CONST_JSON)) return seedProjects;
    const data = fs.readFileSync(CONST_JSON, 'utf8');
    return JSON.parse(data || '[]');
  } catch { return seedProjects; }
}

function writeProjects(data) {
  try {
    if (!fs.existsSync(path.dirname(CONST_JSON))) {
      fs.mkdirSync(path.dirname(CONST_JSON), { recursive: true });
    }
    fs.writeFileSync(CONST_JSON, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // Read-only filesystem fallback on Vercel
  }
}

// GET /api/construction
export async function GET() {
  try {
    let items = await db.getAll('construction');
    if (!items || items.length === 0) {
      items = readProjects();
    }
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(readProjects());
  }
}

// POST /api/construction
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, budget, spent, status, date, progress } = body;

    if (!title || !budget) {
      return NextResponse.json({ error: 'Title and Budget are required' }, { status: 400 });
    }

    const newProject = {
      id: `proj_${Date.now()}`,
      title: String(title).trim(),
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      progress: Number(progress) || 0,
      status: status || 'On Track',
      date: date || 'TBD',
      createdAt: new Date().toISOString()
    };

    await db.create('construction', newProject);

    const projects = readProjects();
    projects.unshift(newProject);
    writeProjects(projects);

    return NextResponse.json({ success: true, item: newProject });
  } catch (error) {
    console.error('Construction POST error:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}
