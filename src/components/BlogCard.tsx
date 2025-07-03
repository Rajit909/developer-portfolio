import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
        <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
            <CardHeader>
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                <CardDescription>
                {format(new Date(post.date), 'MMMM d, yyyy')} by {post.author}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
        </Card>
    </Link>
  );
}
