import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');

    const achievements = await db
      .collection('achievements')
      .find({})
      .sort({ year: -1 })
      .toArray();

    return NextResponse.json(achievements);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch achievements.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
