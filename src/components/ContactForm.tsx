"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleContactForm } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';

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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
            ) : (
                <>
                    Send Message <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export default function ContactForm() {
    const [state, formAction] = useActionState(handleContactForm, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            if(state.errors && Object.keys(state.errors).length > 0){
                toast({
                    title: 'Error',
                    description: state.message,
                    variant: 'destructive',
                });
            } else {
                 toast({
                    title: 'Success!',
                    description: state.message,
                });
            }
        }
    }, [state, toast]);

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">Contact Me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your Name" />
                        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="your.email@example.com" />
                         {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="Your message..." rows={5} />
                         {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
