export type Project = {
  _id?: string;
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
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML content
  author: string;
  authorImage: string;
  date: string;
  tags: string[];
  imageUrl: string;
  'data-ai-hint'?: string;
};


export type Achievement = {
    _id?: string;
    title: string;
    description: string;
    year: string | number;
    icon: string;
};

export type Tech = {
    _id?: string;
    name: string;
    icon: string;
};

export type Profile = {
    _id?: string;
    name: string;
    headline: string;
    bio: string;
    profilePictureUrl: string;
    'data-ai-hint'?: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
};
