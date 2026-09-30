export interface ProjectCard {
  id: string;
  title: string;
  type: "personal" | "commercial";
  period: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  badge: string;
  screenshots: string[];
}

export const projectsList: ProjectCard[] = [
  {
    id: "doggiesdiet",
    title: "DoggiesDiet AI",
    type: "commercial",
    period: "08/2025 - 08/2026",
    description: "Mobile application designed to generate pet nutrition reports and register food items through AI photograph analysis and computer vision, backed by a high-concurrency .NET 8 microservice and Redis caching.",
    techStack: ["React Native", "Expo", ".NET 8", "C#", "PostgreSQL", "Redis", "RevenueCat"],
    badge: "AI & Mobile Ecosystem",
    screenshots: [
      "/images/projects/doggiesdiet-1.png",
      "/images/projects/doggiesdiet-2.png"
    ]
  },
  {
    id: "hikisa",
    title: "Carnes Hikisa Web Catalog",
    type: "commercial",
    period: "03/2026 - 06/2026",
    description: "Commercial web catalog application showcasing meat cuts with high-performance image optimization, category carousels, and fluid Framer Motion animations deployed on Cloudflare Pages.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Cloudflare Pages"],
    githubUrl: "https://distribuidoracarneshikisa.com/",
    badge: "E-Commerce Web",
    screenshots: [
      "/images/projects/carnesHikisa2.png",
      "/images/projects/carnesHikisa1.png"
    ]
  },
   {
    id: "genesis1",
    title: "Genesis Christian School Platform",
    type: "commercial",
    period: "07/2026 - 09/2026",
    description: "Comprehensive institutional web platform featuring virtual tours, interactive calendar modules, and relational database schemas managed via Drizzle ORM and PostgreSQL on Cloudflare Workers.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Drizzle ORM", "PostgreSQL", "Cloudflare Workers"],
    githubUrl: "https://github.com/TitoManri",
    badge: "Enterprise Platform",
    screenshots: [
      "/images/projects/genesis-1.png",
      "/images/projects/genesis-2.png"
    ]
  },
  {
    id: "genesis",
    title: "Genesis Christian School Platform",
    type: "personal",
    period: "07/2026 - 09/2026",
    description: "Comprehensive institutional web platform featuring virtual tours, interactive calendar modules, and relational database schemas managed via Drizzle ORM and PostgreSQL on Cloudflare Workers.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Drizzle ORM", "PostgreSQL", "Cloudflare Workers"],
    githubUrl: "https://github.com/TitoManri",
    badge: "Enterprise Platform",
    screenshots: [
      "/images/projects/genesis-1.png",
      "/images/projects/genesis-2.png"
    ]
  }
];