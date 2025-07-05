import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');

    const projects = await db
      .collection('projects')
      .find({})
      .sort({ featured: -1 }) // Sort featured projects first
      .toArray();

    return NextResponse.json(projects);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch projects.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
