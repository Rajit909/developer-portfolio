import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { profileData } from '@/lib/data';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');
    let profile = await db.collection('profile').findOne({});

    // If no profile exists, seed the database with default data
    if (!profile) {
      const { _id, ...seedData } = profileData;
      const result = await db.collection('profile').insertOne(seedData);
      // Find the newly inserted document to return it
      profile = await db.collection('profile').findOne({_id: result.insertedId });
    }

    return NextResponse.json(profile);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch profile.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
