import type { Project, BlogPost, Achievement, Tech, Profile } from './types';

export const profileData: Profile = {
    name: 'Rajit Kumar',
    headline: 'Crafting Digital Experiences',
    bio: 'A passionate developer building modern, responsive, and user-centric web applications. Explore my work and thoughts on technology.',
    profilePictureUrl: 'https://placehold.co/300x300.png',
    'data-ai-hint': 'profile photo',
    githubUrl: '#',
    linkedinUrl: '#',
    twitterUrl: '#',
};

export const techStack: Tech[] = [
    { name: 'React', icon: 'React' },
    { name: 'Next.js', icon: 'Next.js' },
    { name: 'TypeScript', icon: 'TypeScript' },
    { name: 'Node.js', icon: 'Node.js' },
    { name: 'Tailwind CSS', icon: 'Tailwind CSS' },
    { name: 'PostgreSQL', icon: 'Database' },
    { name: 'Genkit', icon: 'Code' },
];

export const projects: Project[] = [
  {
    slug: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with a modern tech stack.',
    longDescription: 'This project is a feature-rich e-commerce platform built with Next.js, TypeScript, and Stripe for payments. It includes user authentication, product catalog, shopping cart, and a complete checkout process. The backend is powered by Node.js and Express, with a PostgreSQL database.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Node.js', 'PostgreSQL'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'e-commerce checkout',
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'A collaborative task management tool for teams.',
    longDescription: 'A Kanban-style task management application designed for team collaboration. Features include drag-and-drop boards, real-time updates with WebSockets, user assignments, and project analytics. Built using the MERN stack (MongoDB, Express, React, Node.js).',
    technologies: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'kanban board',
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
   {
    slug: 'data-visualization-dashboard',
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets.',
    longDescription: 'This dashboard allows users to upload, process, and visualize large datasets through interactive charts and graphs. Built with D3.js and React, it provides various chart types and customization options to explore data effectively.',
    technologies: ['React', 'D3.js', 'TypeScript'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'analytics dashboard',
    featured: true,
  },
  {
    slug: 'portfolio-website',
    title: 'This Portfolio Website',
    description: 'The very portfolio you are browsing now!',
    longDescription: 'This portfolio was built to showcase my skills in modern web development. It uses Next.js for server-side rendering and static site generation, Tailwind CSS for styling, and Genkit for AI-powered features like blog tag suggestions. It is fully responsive and designed for a great user experience.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Genkit'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'code editor',
    githubUrl: '#',
  },
];

// This is now fallback data. The app will fetch from the database.
export const blogPosts: BlogPost[] = [
  {
    slug: 'mastering-server-components',
    title: 'Mastering React Server Components in Next.js 14',
    excerpt: 'A deep dive into the paradigm shift of Server Components and how they can supercharge your Next.js applications.',
    content: `
React Server Components (RSCs) are a new architecture that allows you to render components on the server, reducing the amount of JavaScript sent to the client. This results in faster initial page loads and a better user experience.

In this post, we'll explore:
- What Server Components are and how they differ from Client Components.
- The benefits of using RSCs, including performance and data fetching.
- How to implement them in a Next.js 14 application.
- Best practices and common pitfalls to avoid.

Let's get started!
    `,
    author: 'Rajit Kumar',
    authorImage: 'https://placehold.co/40x40.png',
    date: '2024-07-20',
    tags: ['Next.js', 'React', 'Web Development', 'Performance'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'react code',
  },
  {
    slug: 'ai-in-modern-web-dev',
    title: 'Integrating AI into Modern Web Development',
    excerpt: 'Explore how to leverage AI tools and services like Genkit to build smarter, more interactive web applications.',
    content: `
Artificial Intelligence is no longer a futuristic concept; it's a tool that developers can use today to enhance their applications. From chatbots to content generation, the possibilities are endless.

This article will cover:
- An overview of available AI APIs and models.
- A practical guide to using Google's Genkit in a Next.js project.
- Building an AI-powered feature: automatic blog post tagging.
- The ethical considerations and future of AI in web development.
    `,
    author: 'Rajit Kumar',
    authorImage: 'https://placehold.co/40x40.png',
    date: '2024-07-15',
    tags: ['AI', 'Genkit', 'Next.js', 'API'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'artificial intelligence brain',
  },
  {
    slug: 'tailwind-css-best-practices',
    title: 'Styling at Scale: Tailwind CSS Best Practices',
    excerpt: 'Learn how to keep your Tailwind CSS projects maintainable, scalable, and easy to read with these tips and tricks.',
    content: `
Tailwind CSS has revolutionized how we think about styling. However, with great power comes great responsibility. Long class strings and inconsistent design tokens can quickly lead to a messy codebase.

In this post, we'll discuss:
- Organizing your \`tailwind.config.js\` file effectively.
- Using \`@apply\` for reusable component classes.
- Strategies for responsive design.
- Plugins and tools to streamline your workflow.
    `,
    author: 'Rajit Kumar',
    authorImage: 'https://placehold.co/40x40.png',
    date: '2024-07-10',
    tags: ['CSS', 'Tailwind CSS', 'Web Design'],
    imageUrl: 'https://placehold.co/800x600.png',
    'data-ai-hint': 'css code',
  },
];


export const achievements: Achievement[] = [
    {
        icon: 'Trophy',
        year: 2023,
        title: 'Top-Rated Developer',
        description: 'Received "Top-Rated" status on a major freelancing platform for consistent high-quality work.',
    },
    {
        icon: 'Award',
        year: 2022,
        title: 'Community Contribution Award',
        description: 'Recognized for significant contributions to open-source projects and developer communities.',
    },
    {
        icon: 'Code',
        year: '2021',
        title: 'Hackathon Winner',
        description: 'First place in the annual "Code for Good" hackathon, developing an app for local charities.',
    },
    {
        icon: 'Users',
        year: '2020',
        title: 'Featured Speaker',
        description: 'Invited to speak at a regional tech conference about modern frontend development techniques.',
    }
];
