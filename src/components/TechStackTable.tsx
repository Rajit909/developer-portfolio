"use client";

import { useState } from 'react';
import type { Tech } from '@/lib/types';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteTech } from '@/lib/actions';
import { Edit, Trash2, Loader2, Code } from 'lucide-react';
import Link from 'next/link';
import { iconMap } from '@/lib/tech-icons';

interface TechStackTableProps {
  techStack: Tech[];
}

export default function TechStackTable({ techStack }: TechStackTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeletingId(id);
    const result = await deleteTech(id);
    setIsDeleting(false);
    setDeletingId(null);

    if (result.success) {
      toast({
        title: 'Tech Deleted',
        description: 'The technology has been successfully deleted.',
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
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {techStack.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No technologies found.
                </TableCell>
              </TableRow>
          )}
          {techStack.map((tech) => {
            const Icon = iconMap[tech.icon] ?? Code;
            return (
                <TableRow key={tech._id}>
                <TableCell><Icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                <TableCell className="font-medium">{tech.name}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/settings/${tech._id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            {isDeleting && deletingId === tech._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            <span className="sr-only">Delete</span>
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tech item "{tech.name}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            onClick={() => handleDelete(tech._id!)}
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
