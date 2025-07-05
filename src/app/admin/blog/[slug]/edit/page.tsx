import { getBlogPostBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditPostForm from '@/components/EditPostForm';
import { BlogPost } from '@/lib/types';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // The form expects a plain object, so we convert the MongoDB _id if it exists
  const plainPost = JSON.parse(JSON.stringify(post)) as BlogPost;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Edit Post</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Make changes to your blog post and save them.
        </p>
      </div>
      <EditPostForm post={plainPost} />
    </div>
  );
}
