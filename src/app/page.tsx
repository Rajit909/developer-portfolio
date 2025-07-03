import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { projects, blogPosts, achievements, techStack } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import AchievementCard from '@/components/AchievementCard';
import TechStack from '@/components/TechStack';

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="py-16 md:py-24 opacity-0 animate-fade-in-up">
        <div className="container mx-auto grid md:grid-cols-[2fr,1fr] gap-12 items-center text-center md:text-left">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
              Crafting Digital Experiences
            </h1>
            <p className="max-w-2xl mx-auto md:mx-0 text-lg text-muted-foreground">
              A passionate developer building modern, responsive, and user-centric web applications. Explore my work and thoughts on technology.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Button asChild size="lg">
                <Link href="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64">
            <Image
              src="https://placehold.co/300x300.png"
              alt="Profile Picture"
              width={300}
              height={300}
              className="rounded-full object-cover shadow-lg border-4 border-card"
              data-ai-hint="profile photo"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="font-headline text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

       {/* Tech Stack Section */}
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="font-headline text-3xl font-bold mb-12 text-center">My Tech Stack</h2>
        <TechStack technologies={techStack} />
      </section>

      {/* Achievements Section */}
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <h2 className="font-headline text-3xl font-bold mb-12 text-center">My Achievements</h2>
         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.title} achievement={achievement} index={index} />
          ))}
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <h2 className="font-headline text-3xl font-bold mb-8 text-center">From the Blog</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center">
            <Button asChild variant="link">
                <Link href="/blog">Read More Posts <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
