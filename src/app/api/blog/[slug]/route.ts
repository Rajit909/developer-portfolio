import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface PageProps {
    params: {
      slug: string;
    };
  }

export async function GET(request: Request, { params }: PageProps) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ slug: params.slug });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch post.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
