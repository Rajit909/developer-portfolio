
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleNewProject } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const initialState = {
  message: null,
  errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
            ) : (
                <>
                    Create Project <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export default function NewProjectForm() {
    const [state, formAction] = useActionState(handleNewProject, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                title: 'Error Creating Project',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">New Project</CardTitle>
                    <CardDescription>Fill in the details for your new project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="My Awesome Project" />
                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea id="description" name="description" placeholder="A brief, one-sentence summary of the project." rows={2} />
                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description</Label>
                        <Textarea id="longDescription" name="longDescription" placeholder="A detailed description of the project, its features, and the technology used." rows={5} />
                        {state.errors?.longDescription && <p className="text-sm text-destructive">{state.errors.longDescription[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input id="technologies" name="technologies" placeholder="React, Next.js, Tailwind CSS" />
                        {state.errors?.technologies && <p className="text-sm text-destructive">{state.errors.technologies[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/800x600.png" />
                        {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
                            <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/user/repo" />
                             {state.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="liveUrl">Live Demo URL (optional)</Label>
                            <Input id="liveUrl" name="liveUrl" placeholder="https://myproject.com" />
                            {state.errors?.liveUrl && <p className="text-sm text-destructive">{state.errors.liveUrl[0]}</p>}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="featured" name="featured" />
                        <Label htmlFor="featured">Feature this project on the homepage?</Label>
                    </div>

                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
