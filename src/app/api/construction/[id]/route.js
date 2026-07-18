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
  fs.writeFileSync(CONST_JSON, JSON.stringify(data, null, 2), 'utf8');
}

// DELETE /api/construction/[id]
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const projects = readProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    writeProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// PATCH /api/construction/[id]
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const projects = readProjects();
    const idx = projects.findIndex(p => p.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (body.title !== undefined) projects[idx].title = body.title;
    if (body.budget !== undefined) projects[idx].budget = Number(body.budget);
    if (body.spent !== undefined) projects[idx].spent = Number(body.spent);
    if (body.progress !== undefined) projects[idx].progress = Number(body.progress);
    if (body.status !== undefined) projects[idx].status = body.status;
    if (body.date !== undefined) projects[idx].date = body.date;
    projects[idx].updatedAt = new Date().toISOString();

    writeProjects(projects);
    return NextResponse.json({ success: true, item: projects[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
