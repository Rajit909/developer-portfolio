import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export default function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href={profile.twitterUrl} aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href={profile.githubUrl} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href={profile.linkedinUrl} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
