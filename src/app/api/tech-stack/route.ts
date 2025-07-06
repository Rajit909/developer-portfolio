import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { techStack as seedData } from '@/lib/data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    const collection = db.collection('techStack');

    let items = await collection.find({}).toArray();

    // If the collection is empty, seed it with the static data
    if (items.length === 0) {
      // The seed data from data.ts is already in the correct format { name: string, icon: string }
      await collection.insertMany(seedData);
      items = await collection.find({}).toArray();
    }

    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch tech stack.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
