import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, Briefcase, Award } from 'lucide-react';
import { getBlogPosts, getProjects, getAchievements } from '@/lib/api';

export default async function AdminDashboard() {
    const posts = await getBlogPosts();
    const projects = await getProjects();
    const achievements = await getAchievements();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Rajit! Here's an overview of your portfolio.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
                        <Newspaper className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts.length}</div>
                        <p className="text-xs text-muted-foreground">posts currently published</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.length}</div>
                        <p className="text-xs text-muted-foreground">projects showcased</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{achievements.length}</div>
                        <p className="text-xs text-muted-foreground">achievements listed</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Here are the next steps to complete your admin panel:</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                        <li>Migrate Projects and Achievements to the database.</li>
                        <li>Build management pages for Projects and Achievements (Add, Edit, Delete).</li>
                        <li>Implement functionality for the Profile and Settings pages.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export const dynamic = 'force-dynamic';
