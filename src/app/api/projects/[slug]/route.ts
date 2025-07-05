import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface PageProps {
    params: {
      slug: string;
    };
  }

export async function GET(request: Request, { params }: PageProps) {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio-data');

    const project = await db.collection('projects').findOne({ slug: params.slug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch project.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
