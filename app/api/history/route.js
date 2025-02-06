import { writeFile, readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const historyFilePath = path.join(process.cwd(), 'data', 'history.json');

export async function GET() {
  try {
    const data = await readFile(historyFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ history: [] });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const currentData = await readFile(historyFilePath, 'utf8')
      .then(data => JSON.parse(data))
      .catch(() => ({ history: [] }));
    
    currentData.history = [data, ...currentData.history].slice(0, 100); // Keep last 100 records
    await writeFile(historyFilePath, JSON.stringify(currentData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
