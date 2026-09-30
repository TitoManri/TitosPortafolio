export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  location: string;
  details: string[];
}

export const experiences: ExperienceItem[] = [
  {
    period: "08/2025 - 08/2026",
    role: "Mobile & Backend Developer",
    company: "Doggies Diet AI",
    location: "San José, Costa Rica",
    description: [
      "Built a cross-platform mobile application using React Native and Expo Router, featuring AI-assisted dietary meal reporting and computer vision food analysis.",
      "Developed a scalable backend microservice using .NET 8, C#, PostgreSQL, and Redis caching layer, maintaining sub-100ms API responses for high-concurrency requests.",
      "Integrated RevenueCat payment infrastructure to manage multi-tiered in-app subscriptions, automated SSO via Google and Apple, and streamlined user onboarding."
    ],
    skills: ["React Native", "Expo Router", ".NET 8", "C#", "PostgreSQL", "Redis", "RevenueCat"]
  },
  {
    period: "09/2024 - 08/2025",
    role: "Full-Stack Software Engineer (Academic Partner Project)",
    company: "Inter-American Court Of Human Rights (Corte IDH)",
    location: "San José, Costa Rica",
    description: [
      "Designed and built an enterprise-grade employee management portal using ASP.NET Core MVC, Razor Pages, .NET 8, C#, and SQL Server adhering strictly to Clean Architecture principles.",
      "Implemented dynamic frontend user interfaces and reactive components using JavaScript, HTML5, and CSS3, streamlining internal administrative workflows and user interactions.",
      "Developed automated unit testing suites with xUnit across core business layers, reducing system regressions by over 30% prior to deployment."
    ],
    skills: [".NET 8", "C#", "ASP.NET Core MVC", "Razor Pages", "SQL Server", "xUnit", "Clean Architecture"]
  },
  {
    period: "01/2024 - 03/2024",
    role: "Software Engineering Intern",
    company: "Ministry of Public Works and Transport (MOPT)",
    location: "San José, Costa Rica",
    description: [
      "Assisted in modernizing legacy internal software tools by refactoring backend code structures and optimizing database queries.",
      "Collaborated with senior engineering teams to analyze system bottlenecks, contributing to documented efficiency gains in daily internal data workflows.",
      "Documented technical workflows, database schemas, and standard operating procedures (SOPs) for internal system integration."
    ],
    skills: [".NET", "SQL Server", "Backend Architecture", "Query Optimization"]
  }
];

export const educations: EducationItem[] = [
  {
    period: "01/2023 - 06/2026",
    degree: "Bachelor's Degree in Computer Systems Engineering",
    institution: "Universidad Fidélitas",
    location: "San José, Costa Rica",
    details: [
      "Developed and delivered comprehensive full-stack software engineering projects utilizing modern architectural patterns, clean code principles, and structured relational database design.",
      "Applied systems analysis and design methodologies to solve complex technical problems, collaborating in team-based software development life cycle (SDLC) environments.",
      "Engineered robust backend services and optimized data persistence layers, implementing rigorous testing and documentation standards for scalable applications."
    ]
  }
];