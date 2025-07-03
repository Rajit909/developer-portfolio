import { getBlogPosts } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
            <h1 className="font-headline text-4xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">My thoughts on tech, development, and more.</p>
        </div>
        <Button asChild>
            <Link href="/blog/new">Create New Post</Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
