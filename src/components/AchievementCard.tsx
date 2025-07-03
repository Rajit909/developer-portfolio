import type { Achievement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

export default function AchievementCard({ achievement, index }: AchievementCardProps) {
  const Icon = achievement.icon;
  return (
    <Card 
      className="flex flex-col h-full text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardHeader className="items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-3">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-xl">{achievement.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{achievement.description}</p>
      </CardContent>
      <CardFooter>
          <Badge variant="secondary">{achievement.year}</Badge>
      </CardFooter>
    </Card>
  );
}
