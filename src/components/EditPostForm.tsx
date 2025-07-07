
"use client";

import { useState, useEffect, useActionState, useRef } from 'react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { getTagSuggestions, handleUpdatePost, getBlogContentSuggestion, getBlogImageSuggestion } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, Loader2, ArrowRight, Wand2, Upload, ImageIcon } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from './ui/textarea';

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
                    Update Post <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

interface EditPostFormProps {
    post: BlogPost;
}

export default function EditPostForm({ post }: EditPostFormProps) {
    const [state, formAction] = useActionState(handleUpdatePost.bind(null, post.slug), initialState);
    const { toast } = useToast();

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [textContent, setTextContent] = useState('');
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(post.tags));
    const [isSuggestingTags, setIsSuggestingTags] = useState(false);
    const [isSuggestingContent, setIsSuggestingContent] = useState(false);
    
    const [imageSrc, setImageSrc] = useState<string | null>(post.imageUrl);
    const [imagePrompt, setImagePrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.message) {
            toast({
                title: 'Error Updating Post',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    const handleSuggestTags = async () => {
        setIsSuggestingTags(true);
        const result = await getTagSuggestions(textContent);
        setIsSuggestingTags(false);

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

    const handleSuggestContent = async () => {
        setIsSuggestingContent(true);
        const result = await getBlogContentSuggestion(title);
        setIsSuggestingContent(false);

        if (result.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        } else if (result.content) {
            setContent(result.content);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        const result = await getBlogImageSuggestion(imagePrompt);
        setIsGeneratingImage(false);

        if (result.error) {
            toast({
                title: 'Error Generating Image',
                description: result.error,
                variant: 'destructive',
            });
        } else if (result.imageUrl) {
            setImageSrc(result.imageUrl);
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
                    <CardTitle className="font-headline">Edit Blog Post</CardTitle>
                    <CardDescription>Make changes to your post below. Changes will be saved to the database.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                         <div className="flex items-center gap-2">
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex-grow"
                                placeholder="Your amazing blog post title"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSuggestContent}
                                disabled={isSuggestingContent || title.length < 5}
                                className="shrink-0"
                            >
                                {isSuggestingContent ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Suggest Content
                                    </>
                                )}
                            </Button>
                        </div>
                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <RichTextEditor
                            value={content}
                            onChange={(html, text) => {
                                setContent(html);
                                setTextContent(text);
                            }}
                        />
                        <textarea name="content" value={content} className="hidden" readOnly />
                        {state.errors?.content && <p className="text-sm text-destructive">{state.errors.content[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                <TabsTrigger value="ai">Generate with AI</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload">
                                <Card>
                                    <CardContent className="p-4 space-y-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Upload a new image to replace the current one.
                                        </p>
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Select Image
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/webp"
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                             <TabsContent value="ai">
                                 <Card>
                                     <CardContent className="p-4 space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="image-prompt">Image Prompt</Label>
                                            <Textarea
                                                id="image-prompt"
                                                placeholder="e.g., A futuristic city skyline at sunset, digital art"
                                                value={imagePrompt}
                                                onChange={(e) => setImagePrompt(e.target.value)}
                                            />
                                         </div>
                                         <Button
                                            type="button"
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage || imagePrompt.length < 5}
                                        >
                                            {isGeneratingImage ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="mr-2 h-4 w-4" />
                                                    Generate Image
                                                </>
                                            )}
                                        </Button>
                                     </CardContent>
                                 </Card>
                            </TabsContent>
                        </Tabs>
                        
                        {imageSrc ? (
                            <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border">
                                <Image src={imageSrc} alt="Blog post image preview" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="mt-4 flex flex-col items-center justify-center gap-2 aspect-video w-full rounded-lg border border-dashed">
                                <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Image Preview</p>
                            </div>
                        )}
                        <input type="hidden" name="imageUrl" value={imageSrc || ''} />
                        {state.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
                    </div>
                    
                    <div className="space-y-4">
                        <Label>Tags</Label>
                        <input type="hidden" name="tags" value={Array.from(selectedTags).join(', ')} />
                        <div className="space-y-2">
                             <Button type="button" onClick={handleSuggestTags} disabled={isSuggestingTags || !textContent || textContent.length < 50}>
                                {isSuggestingTags ? (
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
                                The editor must contain at least 50 characters to enable AI suggestions.
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
