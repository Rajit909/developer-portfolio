
"use client";

import { useActionState, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { handleNewProject, getProjectDescriptionSuggestion, getBlogImageSuggestion } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Loader2, Checkbox, Wand2, Upload, ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
            ) : (
                <>
                    Create Project <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export default function NewProjectForm() {
    const [state, formAction] = useActionState(handleNewProject, initialState);
    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [imagePrompt, setImagePrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.message) {
             toast({
                title: state.errors && Object.keys(state.errors).length > 0 ? 'Error Creating Project' : 'Project Created!',
                description: state.message,
                variant: state.errors && Object.keys(state.errors).length > 0 ? 'destructive' : 'default',
            });
        }
    }, [state, toast]);

    const handleSuggestDescription = async () => {
        setIsSuggestingDescription(true);
        const result = await getProjectDescriptionSuggestion(title);
        setIsSuggestingDescription(false);

        if (result.error) {
            toast({
                title: 'Error Generating Description',
                description: result.error,
                variant: 'destructive',
            });
        } else if (result.descriptions) {
            setShortDescription(result.descriptions.shortDescription);
            setLongDescription(result.descriptions.longDescription);
            toast({
                title: 'Success!',
                description: 'Project descriptions have been generated.',
            });
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 200 * 1024) { // 200KB limit
                toast({
                    title: 'Image Too Large',
                    description: 'Please upload an image smaller than 200KB.',
                    variant: 'destructive',
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        // We can reuse the blog image suggestion logic here
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


    return (
        <Card>
            <form action={formAction}>
                <CardHeader>
                    <CardTitle className="font-headline">New Project</CardTitle>
                    <CardDescription>Fill in the details for your new project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <div className="flex items-center gap-2">
                            <Input 
                                id="title" 
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="My Awesome Project" 
                            />
                             <Button
                                type="button"
                                variant="outline"
                                onClick={handleSuggestDescription}
                                disabled={isSuggestingDescription || title.length < 5}
                                className="shrink-0"
                            >
                                {isSuggestingDescription ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Suggest
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Write a title (at least 5 characters) to enable AI suggestions.</p>
                        {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea 
                            id="description" 
                            name="description" 
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            placeholder="A brief, one-sentence summary of the project." 
                            rows={2} 
                        />
                        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Long Description</Label>
                        <Textarea 
                            id="longDescription" 
                            name="longDescription" 
                            value={longDescription}
                            onChange={(e) => setLongDescription(e.target.value)}
                            placeholder="A detailed description of the project, its features, and the technology used." 
                            rows={5} 
                        />
                        {state.errors?.longDescription && <p className="text-sm text-destructive">{state.errors.longDescription[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input id="technologies" name="technologies" placeholder="React, Next.js, Tailwind CSS" />
                        {state.errors?.technologies && <p className="text-sm text-destructive">{state.errors.technologies[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label>Project Image</Label>
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                <TabsTrigger value="ai">Generate with AI</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upload">
                                <Card>
                                    <CardContent className="p-4 space-y-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Upload an image. Max size: 200KB.
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
                                                placeholder="e.g., A sleek dashboard for a task management app, digital art"
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
                                <Image src={imageSrc} alt="Project image preview" fill className="object-cover" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
                            <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/user/repo" />
                             {state.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="liveUrl">Live Demo URL (optional)</Label>
                            <Input id="liveUrl" name="liveUrl" placeholder="https://myproject.com" />
                            {state.errors?.liveUrl && <p className="text-sm text-destructive">{state.errors.liveUrl[0]}</p>}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="featured" name="featured" />
                        <Label htmlFor="featured">Feature this project on the homepage?</Label>
                    </div>

                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}
