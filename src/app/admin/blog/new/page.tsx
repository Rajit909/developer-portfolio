import NewPostForm from '@/components/NewPostForm';

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Create New Post</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Write your thoughts and get AI-powered tag suggestions.
        </p>
      </div>
      <NewPostForm />
    </div>
  );
}
