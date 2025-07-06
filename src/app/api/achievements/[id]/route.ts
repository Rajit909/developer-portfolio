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

    const achievement = await db.collection('achievements').findOne({ _id: new ObjectId(params.id) });

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found.' }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch achievement.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
