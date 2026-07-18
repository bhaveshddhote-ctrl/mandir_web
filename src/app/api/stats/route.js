import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const entries = await db.getAll('ledger');

    const totalIn = entries
      .filter(e => e.type === 'in')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const totalOut = entries
      .filter(e => e.type === 'out')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const balance = totalIn - totalOut;

    // Group by month for chart data
    const monthMap = {};
    entries.forEach(e => {
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString('en-IN', { month: 'short' });
      if (!monthMap[key]) monthMap[key] = { name: key, donations: 0, expenses: 0 };
      if (e.type === 'in') monthMap[key].donations += e.amount || 0;
      else monthMap[key].expenses += e.amount || 0;
    });

    const chartData = Object.values(monthMap);

    // Recent activity (latest 5)
    const recent = [...entries]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(e => ({
        id: e._id,
        type: e.type === 'in' ? 'donation' : 'expense',
        user: e.name || (e.type === 'in' ? 'Anonymous Donor' : 'Expense'),
        amount: e.amount?.toLocaleString('en-IN'),
        desc: e.desc,
        time: new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      }));

    return NextResponse.json({
      stats: {
        donations: totalIn.toLocaleString('en-IN'),
        expenses: totalOut.toLocaleString('en-IN'),
        balance: balance.toLocaleString('en-IN'),
        entries: entries.length
      },
      chartData,
      activity: recent
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
