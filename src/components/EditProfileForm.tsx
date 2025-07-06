"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleUpdateProfile } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { Profile } from '@/lib/types';

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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
            ) : (
                <>
                    Update Profile <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

interface EditProfileFormProps {
    profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
    const [state, formAction] = useActionState(handleUpdateProfile, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            if(state.errors && Object.keys(state.errors).length > 0){
                toast({
                    title: 'Error Updating Profile',
                    description: state.message,
                    variant: 'destructive',
                });
            } else {
                 toast({
                    title: 'Profile Updated!',
                    description: 'Your changes have been saved successfully.',
                });
            }
        }
    }, [state, toast]);

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">Profile Details</CardTitle>
                    <CardDescription>This information is displayed publicly on your site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={profile.name} />
                        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" name="headline" defaultValue={profile.headline} />
                        {state.errors?.headline && <p className="text-sm text-destructive">{state.errors.headline[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio / Tagline</Label>
                        <Textarea id="bio" name="bio" defaultValue={profile.bio} rows={3} />
                        {state.errors?.bio && <p className="text-sm text-destructive">{state.errors.bio[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                        <Input id="profilePictureUrl" name="profilePictureUrl" defaultValue={profile.profilePictureUrl} />
                        {state.errors?.profilePictureUrl && <p className="text-sm text-destructive">{state.errors.profilePictureUrl[0]}</p>}
                    </div>
                    <CardTitle className="font-headline pt-4 border-t">Social Links</CardTitle>
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">GitHub URL</Label>
                        <Input id="githubUrl" name="githubUrl" defaultValue={profile.githubUrl} />
                        {state.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input id="linkedinUrl" name="linkedinUrl" defaultValue={profile.linkedinUrl} />
                        {state.errors?.linkedinUrl && <p className="text-sm text-destructive">{state.errors.linkedinUrl[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                        <Input id="twitterUrl" name="twitterUrl" defaultValue={profile.twitterUrl} />
                        {state.errors?.twitterUrl && <p className="text-sm text-destructive">{state.errors.twitterUrl[0]}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
