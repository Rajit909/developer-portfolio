
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            toast({
                title: 'Account Created!',
                description: "You can now sign in with your new credentials.",
            });
            // Using window.history.replaceState to avoid re-rendering with router.replace
            window.history.replaceState(null, '', '/login');
        }
    }, [searchParams, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setIsLoading(false);

        if (result?.error) {
            toast({
                title: 'Login Failed',
                description: 'Invalid email or password. Please try again.',
                variant: 'destructive',
            });
        } else if (result?.ok) {
             toast({
                title: 'Login Successful',
                description: "Welcome back!",
            });
            router.push(callbackUrl);
            router.refresh(); // Refresh the page to ensure session is updated
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
                            type="email"
                            placeholder="admin@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
