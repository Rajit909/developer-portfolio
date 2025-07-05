"use client";

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getTagSuggestions, handleNewPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';

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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                </>
            ) : (
                <>
                    Publish Post <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export default function NewPostForm() {
    const [state, formAction] = useActionState(handleNewPost, initialState);
    const { toast } = useToast();

    const [contentValue, setContentValue] = useState('');
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    useEffect(() => {
        if (state.message) {
            if(state.errors && Object.keys(state.errors).length > 0){
                toast({
                    title: 'Error creating post',
                    description: state.message,
                    variant: 'destructive',
                });
            } else {
                 toast({
                    title: 'Success!',
                    description: state.message,
                });
                // Here you would typically reset the form or redirect.
                // For now, we just show the toast.
            }
        }
    }, [state, toast]);

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

    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">New Blog Post</CardTitle>
                    <CardDescription>Fill in the details for your new post. It will be saved to the database.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" />
                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" rows={10} onChange={(e) => setContentValue(e.target.value)} />
                        {state.errors?.content && <p className="text-sm text-destructive">{state.errors.content[0]}</p>}
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Tags</Label>
                        <input type="hidden" name="tags" value={Array.from(selectedTags).join(', ')} />
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
                        {state.errors?.tags && <p className="text-sm text-destructive">{state.errors.tags[0]}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
