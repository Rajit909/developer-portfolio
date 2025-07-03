export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  'data-ai-hint'?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  author: string;
  authorImage: string;
  date: string;
  tags: string[];
  imageUrl: string;
  'data-ai-hint'?: string;
};


export type Achievement = {
    title: string;
    description: string;
    year: string | number;
    icon: React.ComponentType<{ className?: string }>;
};
