import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface PageProps {
    params: {
      id: string;
    };
}

export async function GET(request: Request, { params }: PageProps) {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');

    if (!ObjectId.isValid(params.id)) {
        return NextResponse.json({ error: 'Invalid ID format.' }, { status: 400 });
    }

    const item = await db.collection('techStack').findOne({ _id: new ObjectId(params.id) });

    if (!item) {
      return NextResponse.json({ error: 'Tech item not found.' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch tech item.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
