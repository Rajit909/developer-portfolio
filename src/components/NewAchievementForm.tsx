
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleNewAchievement } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader2, Trophy, Award, Code, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialState = {
  message: null,
  errors: {},
};

const iconOptions = [
    { value: "Trophy", label: "Trophy", icon: Trophy },
    { value: "Award", label: "Award", icon: Award },
    { value: "Code", label: "Code", icon: Code },
    { value: "Users", label: "Community", icon: Users },
];

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
                    Create Achievement <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export default function NewAchievementForm() {
    const [state, formAction] = useActionState(handleNewAchievement, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                title: 'Error Creating Achievement',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">New Achievement</CardTitle>
                    <CardDescription>Fill in the details for your new achievement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Hackathon Winner" />
                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="A brief summary of the achievement." rows={3} />
                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" placeholder="2023" />
                        {state.errors?.year && <p className="text-sm text-destructive">{state.errors.year[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select name="icon">
                            <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {iconOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        <div className="flex items-center gap-2">
                                            <opt.icon className="h-4 w-4" />
                                            <span>{opt.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.icon && <p className="text-sm text-destructive">{state.errors.icon[0]}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
