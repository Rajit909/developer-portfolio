import NewTechForm from '@/components/NewTechForm';

export default function NewTechPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Add New Technology</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Add a new technology to your stack.
        </p>
      </div>
      <NewTechForm />
    </div>
  );
}
