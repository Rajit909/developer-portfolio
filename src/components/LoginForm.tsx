
"use client";

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';
    
    // This effect handles showing a success toast after signing up.
    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            toast({
                title: 'Account Created!',
                description: "You can now sign in with your new credentials.",
            });
            // Use router.replace to remove the query param from the URL without reloading
            router.replace('/login', { scroll: false });
        }
    }, [searchParams, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn('credentials', {
            email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
            password: (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value,
            redirect: false, // Important: we will handle the redirect manually
        });

        setIsLoading(false);

        if (result?.error) {
            toast({
                title: 'Login Failed',
                description: 'Invalid email or password. Please try again.',
                variant: 'destructive',
            });
        } else if (result?.ok) {
            // On success, NextAuth sets the session cookie and we can redirect
            router.push(callbackUrl);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit}>
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
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-center justify-center gap-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                         {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
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
