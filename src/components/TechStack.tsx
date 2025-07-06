import type { Tech } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { iconMap } from '@/lib/tech-icons';
import { Code } from 'lucide-react';


interface TechStackProps {
  technologies: Tech[];
}

export default function TechStack({ technologies }: TechStackProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
        {technologies.map((tech) => {
          const Icon = iconMap[tech.icon] ?? Code;
          return (
            <div key={tech._id || tech.name} className="flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-2">
              <Card className="p-5 w-24 h-24 flex items-center justify-center">
                <Icon className="h-12 w-12 text-primary" />
              </Card>
              <h3 className="text-sm font-medium text-muted-foreground">{tech.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
