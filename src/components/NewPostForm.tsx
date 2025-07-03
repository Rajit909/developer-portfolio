"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getTagSuggestions } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const postSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    content: z.string().min(50, "Content must be at least 50 characters."),
    tags: z.array(z.string()).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function NewPostForm() {
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [isSuggesting, setIsSuggesting] = useState(false);
    const { toast } = useToast();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
    });

    const contentValue = watch("content");

    const handleSuggestTags = async () => {
        setIsSuggesting(true);
        const result = await getTagSuggestions(contentValue);
        setIsSuggesting(false);

        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        } else if (result.tags) {
            setSuggestedTags(result.tags);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tag)) {
                newSet.delete(tag);
            } else {
                newSet.add(tag);
            }
            return newSet;
        });
    };

    const onSubmit = (data: PostFormData) => {
        const finalData = { ...data, tags: Array.from(selectedTags) };
        console.log("Submitting post:", finalData);
        // In a real app, this would save to a database.
        toast({
            title: 'Post Submitted!',
            description: 'Your new blog post has been created.',
        });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="font-headline">New Blog Post</CardTitle>
                    <CardDescription>Fill in the details for your new post.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" {...register("content")} rows={10} />
                        {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Tags</Label>
                        <div className="space-y-2">
                             <Button type="button" onClick={handleSuggestTags} disabled={isSuggesting || !contentValue || contentValue.length < 50}>
                                {isSuggesting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Getting Suggestions...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Suggest Tags with AI
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Write at least 50 characters in the content field to enable AI suggestions.
                            </p>
                        </div>
                       
                        {suggestedTags.length > 0 && (
                             <div className="p-4 border rounded-md bg-secondary/50">
                                <h4 className="font-semibold mb-2 text-sm">AI Suggestions (click to add):</h4>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedTags.map(tag => !selectedTags.has(tag) && (
                                        <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => toggleTag(tag)}>{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTags.size > 0 && (
                            <div className="p-4 border rounded-md">
                                <h4 className="font-semibold mb-2 text-sm">Selected Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(selectedTags).map(tag => (
                                        <Badge key={tag} variant="default" className="flex items-center gap-1">
                                            {tag}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </CardContent>
                <CardFooter>
                    <Button type="submit">Publish Post</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
