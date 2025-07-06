import { getAchievementById } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditAchievementForm from '@/components/EditAchievementForm';
import { Achievement } from '@/lib/types';

interface EditAchievementPageProps {
  params: {
    id: string;
  };
}

export default async function EditAchievementPage({ params }: EditAchievementPageProps) {
  const achievement = await getAchievementById(params.id);

  if (!achievement) {
    notFound();
  }

  // The form expects a plain object, so we convert the MongoDB _id if it exists
  const plainAchievement = JSON.parse(JSON.stringify(achievement)) as Achievement;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Edit Achievement</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Make changes to your achievement and save them.
        </p>
      </div>
      <EditAchievementForm achievement={plainAchievement} />
    </div>
  );
}
