import { blogPosts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto space-y-6">
            <header className="space-y-4">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Image src={post.authorImage} alt={post.author} width={32} height={32} className="rounded-full" />
                        <span>{post.author}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
                </div>
                 <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </header>
            
            <Separator />

            <div className="text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
                {post.content}
            </div>
        </article>
    );
}
