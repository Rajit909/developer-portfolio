import NewAchievementForm from '@/components/NewAchievementForm';

export default function NewAchievementPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Create New Achievement</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Add a new achievement or award to your portfolio.
        </p>
      </div>
      <NewAchievementForm />
    </div>
  );
}
