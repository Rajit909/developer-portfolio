
"use client";

import { useState, useEffect } from 'react';
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
    
    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            toast({
                title: 'Account Created!',
                description: "You can now sign in with your new credentials.",
            });
            router.replace('/login', { scroll: false });
        }
    }, [searchParams, router, toast]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                toast({
                    title: 'Login Successful',
                    description: "Redirecting to the admin panel...",
                });
                router.push(callbackUrl);
                // We don't set isLoading to false on success because the page is navigating away.
            } else {
                const data = await res.json();
                toast({
                    title: 'Login Failed',
                    description: data.message || 'Invalid email or password. Please try again.',
                    variant: 'destructive',
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login Failed',
                description: 'An internal server error occurred. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
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
