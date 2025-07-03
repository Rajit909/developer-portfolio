import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { projects, blogPosts } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';

export default function Home() {
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          Crafting Digital Experiences
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A passionate developer building modern, responsive, and user-centric web applications. Explore my work and thoughts on technology.
        </p>
        <div className="mt-8 flex justify-center gap-4">
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
      </section>

      {/* Featured Projects Section */}
      <section>
        <h2 className="font-headline text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section>
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
