import type { Tech } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

// SVG Icon Components
const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="-11.5 -10.23174 23 20.46348">
    <circle cx="0" cy="0" r="2.05" fill="currentColor"></circle>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);

const NextJSIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 128 128">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128ZM42.5333 103.993V58.6338L85.4667 24.0068V69.3662L42.5333 103.993ZM59.4286 76.5458L68.5714 70.363V76.5458H59.4286Z"
      fill="currentColor"
    ></path>
  </svg>
);

const TypeScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 128 128">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H128V128H0V0ZM39.433 91.853V35.91H88.33V47.558H53.078V59.433H84.145V71.082H53.078V79.943H88.59V91.853H39.433Z"
      fill="currentColor"
    ></path>
  </svg>
);

const TailwindIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 256 256" fill="none">
        <path d="M128 24C65.78 24 16 73.78 16 136C16 198.22 65.78 248 128 248C190.22 248 240 198.22 240 136C240 73.78 190.22 24 128 24ZM180.25 129.75C171.75 138.25 160.75 144.5 147.25 148.25C141.625 149.875 135.875 150.75 130 150.75C118.25 150.75 106.5 146.125 98.375 138C90.25 129.875 85.625 118.125 85.625 106.375C85.625 94.625 90.25 82.875 98.375 74.75C106.5 66.625 118.25 62 130 62C147.5 62 163.625 68.875 174.625 80" fill="currentColor"></path>
    </svg>
);

const NodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 256 256" fill="none">
        <path d="M241.65 142.333C241.65 142.333 234.029 123.111 216.059 113.551C216.059 113.551 216.294 86.6029 200.706 75.3971C185.118 64.1912 159.265 64.1912 159.265 64.1912C159.265 64.1912 143.676 52.8971 127.853 52.8971C112.029 52.8971 96.4412 63.8971 96.4412 63.8971L70.1176 44.8676C70.1176 44.8676 48.3235 59.9412 43.1912 79.5441C38.0588 99.1471 43.1912 118.75 43.1912 118.75L62.2941 131.765C62.2941 131.765 52.1765 147.721 57.0735 168.103C61.9706 188.485 82.4706 200.221 82.4706 200.221L114.382 222.015C114.382 222.015 131.147 232.132 145.412 225.809C159.676 219.485 158.559 200.897 158.559 200.897L185.118 214.515C185.118 214.515 204.044 222.25 216.853 209.676C229.662 197.103 226.706 177.059 226.706 177.059L241.65 142.333Z" fill="currentColor"></path>
    </svg>
);


const iconComponents: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  React: ReactIcon,
  'Next.js': NextJSIcon,
  TypeScript: TypeScriptIcon,
  'Tailwind CSS': TailwindIcon,
  'Node.js': NodeIcon,
};

interface TechStackProps {
  technologies: Tech[];
}

export default function TechStack({ technologies }: TechStackProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
        {technologies.map((tech, index) => {
          const Icon = tech.icon || iconComponents[tech.name];
          return (
            <div key={index} className="flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-2">
              <Card className="p-5 w-24 h-24 flex items-center justify-center">
                {Icon ? (
                  <Icon className="h-12 w-12 text-primary" />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-md" />
                )}
              </Card>
              <h3 className="text-sm font-medium text-muted-foreground">{tech.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
