"use client";

import { useState } from 'react';
import type { Achievement } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteAchievement } from '@/lib/actions';
import { Edit, Trash2, Loader2, Award, Code, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Code,
  Users,
};

interface AchievementsTableProps {
  achievements: Achievement[];
}

export default function AchievementsTable({ achievements }: AchievementsTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingId(id);
    const result = await deleteAchievement(id);
    setIsDeleting(false);
    setDeletingId(null);

    if (result.success) {
      toast({
        title: 'Achievement Deleted',
        description: 'The achievement has been successfully deleted.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No achievements found.
                </TableCell>
              </TableRow>
          )}
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] ?? Trophy;
            return (
                <TableRow key={achievement._id}>
                <TableCell><Icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                <TableCell className="font-medium">{achievement.title}</TableCell>
                <TableCell>{achievement.year}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/achievements/${achievement._id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            {isDeleting && deletingId === achievement._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            <span className="sr-only">Delete</span>
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the achievement titled "{achievement.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            onClick={() => handleDelete(achievement._id!)}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                            >
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                </TableCell>
                </TableRow>
            );
        })}
        </TableBody>
      </Table>
    </div>
  );
}
