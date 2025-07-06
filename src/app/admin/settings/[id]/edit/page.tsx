import { getTechById } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditTechForm from '@/components/EditTechForm';
import { Tech } from '@/lib/types';

interface EditTechPageProps {
  params: {
    id: string;
  };
}

export default async function EditTechPage({ params }: EditTechPageProps) {
  const tech = await getTechById(params.id);

  if (!tech) {
    notFound();
  }

  // The form expects a plain object, so we convert the MongoDB _id if it exists
  const plainTech = JSON.parse(JSON.stringify(tech)) as Tech;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Edit Technology</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Make changes to your tech item and save them.
        </p>
      </div>
      <EditTechForm tech={plainTech} />
    </div>
  );
}
