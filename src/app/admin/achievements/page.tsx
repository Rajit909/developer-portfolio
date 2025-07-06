import { getAchievements } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import AchievementsTable from '@/components/AchievementsTable';

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Manage Achievements</h1>
            <p className="text-muted-foreground">Here you can create, edit, and delete your achievements.</p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Achievement
          </Link>
        </Button>
      </div>
      <AchievementsTable achievements={achievements} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
