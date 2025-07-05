import { getBlogPosts } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import BlogPostsTable from '@/components/BlogPostsTable';

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
            <p className="text-muted-foreground">Here you can create, edit, and delete your blog posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>
      <BlogPostsTable posts={posts} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
