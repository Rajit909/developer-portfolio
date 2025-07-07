
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleSignup } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const initialState = {
  message: null,
  errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
             {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
            ) : (
                "Create Account"
            )}
        </Button>
    );
}

export default function SignupForm() {
    const [state, formAction] = useActionState(handleSignup, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                title: 'Signup Failed',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Card className="w-full max-w-sm">
            <form action={formAction}>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your details to create an admin account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your Name"
                            required
                        />
                         {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@example.com"
                            required
                        />
                         {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                         {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                         {state.errors?.confirmPassword && <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-center justify-center gap-4">
                    <SubmitButton />
                     <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
