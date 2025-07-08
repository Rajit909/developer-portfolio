
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { handleLogin } from '@/lib/actions';

const initialState = {
  message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" type="submit" disabled={pending}>
             {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
            ) : (
                "Sign In"
            )}
        </Button>
    );
}

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [state, formAction] = useActionState(handleLogin, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            toast({
                title: 'Account Created!',
                description: "You can now sign in with your new credentials.",
            });
            router.replace('/login', { scroll: false });
        }
    }, [searchParams, router, toast]);

    useEffect(() => {
        if (state?.message) {
            toast({
                title: 'Login Failed',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Card className="w-full max-w-sm">
            <form action={formAction}>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-center justify-center gap-4">
                    <SubmitButton />
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
