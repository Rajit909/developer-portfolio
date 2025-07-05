import NewProjectForm from '@/components/NewProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Create New Project</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Showcase a new piece of your work.
        </p>
      </div>
      <NewProjectForm />
    </div>
  );
}
