import * as React from 'react';
import { Code, Database, Component, Braces, Rocket, Palette } from 'lucide-react';

export const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, viewBox: "-11.5 -10.23174 23 20.46348" },
    React.createElement('circle', { cx: "0", cy: "0", r: "2.05", fill: "currentColor" }),
    React.createElement('g', { stroke: "currentColor", strokeWidth: "1", fill: "none" },
      React.createElement('ellipse', { rx: "11", ry: "4.2" }),
      React.createElement('ellipse', { rx: "11", ry: "4.2", transform: "rotate(60)" }),
      React.createElement('ellipse', { rx: "11", ry: "4.2", transform: "rotate(120)" })
    )
  )
);

export const NextJSIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, viewBox: "0 0 128 128" },
    React.createElement('path', {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128ZM42.5333 103.993V58.6338L85.4667 24.0068V69.3662L42.5333 103.993ZM59.4286 76.5458L68.5714 70.363V76.5458H59.4286Z",
      fill: "currentColor"
    })
  )
);

export const TypeScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, viewBox: "0 0 128 128" },
    React.createElement('path', {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 0H128V128H0V0ZM39.433 91.853V35.91H88.33V47.558H53.078V59.433H84.145V71.082H53.078V79.943H88.59V91.853H39.433Z",
      fill: "currentColor"
    })
  )
);

export const TailwindIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { ...props, viewBox: "0 0 256 256", fill: "none" },
        React.createElement('path', { d: "M128 24C65.78 24 16 73.78 16 136C16 198.22 65.78 248 128 248C190.22 248 240 198.22 240 136C240 73.78 190.22 24 128 24ZM180.25 129.75C171.75 138.25 160.75 144.5 147.25 148.25C141.625 149.875 135.875 150.75 130 150.75C118.25 150.75 106.5 146.125 98.375 138C90.25 129.875 85.625 118.125 85.625 106.375C85.625 94.625 90.25 82.875 98.375 74.75C106.5 66.625 118.25 62 130 62C147.5 62 163.625 68.875 174.625 80", fill: "currentColor" })
    )
);

export const NodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { ...props, viewBox: "0 0 256 256", fill: "none" },
        React.createElement('path', { d: "M241.65 142.333C241.65 142.333 234.029 123.111 216.059 113.551C216.059 113.551 216.294 86.6029 200.706 75.3971C185.118 64.1912 159.265 64.1912 159.265 64.1912C159.265 64.1912 143.676 52.8971 127.853 52.8971C112.029 52.8971 96.4412 63.8971 96.4412 63.8971L70.1176 44.8676C70.1176 44.8676 48.3235 59.9412 43.1912 79.5441C38.0588 99.1471 43.1912 118.75 43.1912 118.75L62.2941 131.765C62.2941 131.765 52.1765 147.721 57.0735 168.103C61.9706 188.485 82.4706 200.221 82.4706 200.221L114.382 222.015C114.382 222.015 131.147 232.132 145.412 225.809C159.676 219.485 158.559 200.897 158.559 200.897L185.118 214.515C185.118 214.515 204.044 222.25 216.853 209.676C229.662 197.103 226.706 177.059 226.706 177.059L241.65 142.333Z", fill: "currentColor" })
    )
);

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'React': ReactIcon,
  'Next.js': NextJSIcon,
  'TypeScript': TypeScriptIcon,
  'Tailwind CSS': TailwindIcon,
  'Node.js': NodeIcon,
  'Database': Database,
  'Code': Code,
  'Component': Component,
  'Braces': Braces,
  'Rocket': Rocket,
  'Palette': Palette,
};

export const iconOptions = Object.entries(iconMap).map(([name, component]) => ({
    value: name,
    label: name,
    icon: component,
}));
