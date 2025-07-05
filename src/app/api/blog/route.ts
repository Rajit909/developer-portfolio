import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data'); // Use portfolio-data DB

    const posts = await db
      .collection('posts')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch posts.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'; // Make sure it's not cached
