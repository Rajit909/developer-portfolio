import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from './ui/badge';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
             <div className="relative aspect-video overflow-hidden">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={post['data-ai-hint']}
                />
            </div>
            <div className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription>
                    {format(new Date(post.date), 'MMMM d, yyyy')} by {post.author}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-0 mt-4">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardFooter>
            </div>
        </Card>
    </Link>
  );
}
