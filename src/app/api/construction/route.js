import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONST_JSON = path.join(process.cwd(), 'data', 'construction.json');

function readProjects() {
  try {
    if (!fs.existsSync(CONST_JSON)) return [];
    return JSON.parse(fs.readFileSync(CONST_JSON, 'utf8') || '[]');
  } catch { return []; }
}

function writeProjects(data) {
  if (!fs.existsSync(path.dirname(CONST_JSON))) {
    fs.mkdirSync(path.dirname(CONST_JSON), { recursive: true });
  }
  fs.writeFileSync(CONST_JSON, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/construction
export async function GET() {
  try {
    const items = readProjects();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch construction projects' }, { status: 500 });
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

    const projects = readProjects();
    const newProject = {
      id: `proj_${Date.now()}`,
      title: title.trim(),
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      progress: Number(progress) || 0,
      status: status || 'On Track',
      date: date || 'TBD',
      createdAt: new Date().toISOString()
    };

    projects.unshift(newProject);
    writeProjects(projects);

    return NextResponse.json({ success: true, item: newProject });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}
