import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Synappses",
    companyHref: "https://synappses.in",
    role: "Senior Full-Stack Developer",
    duration: "Present",
    summary:
      "Building Synapse (synappses.in / synappses.live), a multi-tenant LMS and creator platform for EdTech businesses to sell courses and engage their audience. Live and onboarding pilot clients.",
    points: [
      "Building the platform with NestJS, TypeScript, Prisma, and React.",
      "Own architecture decisions for a multi-tenant system serving multiple EdTech businesses from a single codebase.",
    ],
  },
  {
    id: 2,
    company: "Competishun (via Newral)",
    role: "Full-Stack Owner",
    duration: "Sept 2025 — Present",
    summary:
      "Own full-stack development for Competishun, a large-scale EdTech platform for JEE/NEET aspirants with 100,000+ active users, serving students concurrently across a ~9-microservice architecture.",
    points: [
      "Reduced backend CPU usage from ~99% to ~25% through SQL query optimization, Redis caching, and workload restructuring.",
      "Redesigned the video upload and transcoding pipeline using FFmpeg, achieving over 80% faster video processing.",
      "Led the migration of 9 microservices from GCP to AWS, improving scalability, reliability, and cost efficiency.",
      "Optimized infrastructure footprint, reducing compute usage from 32 cores to 4 cores.",
      "Resolved critical production issues across multiple microservices, leading to a ~90% reduction in app crashes.",
    ],
  },
  {
    id: 3,
    company: "Upto",
    role: "Backend Owner (Client Project)",
    duration: "Newral client work",
    summary:
      "Built the backend for Upto, a social media application for a US-based client, designing scalable APIs and data models end to end.",
    points: [
      "Designed and built the entire backend solo with NestJS, TypeScript, Prisma, and PostgreSQL.",
      "Modeled the core social data layer (feed, relationships, content) for scale from day one.",
    ],
  },
  {
    id: 4,
    company: "US-based startup (Newral client work)",
    role: "Backend Developer",
    duration: "Newral client work",
    summary:
      "Developed a scalable real-time backend for a separate US-based startup client.",
    points: [
      "Built with Node.js, Express, Redis, and WebSockets for real-time communication at scale.",
    ],
  },
  {
    id: 5,
    company: "Cross-cutting, across all of the above",
    role: "Process & Tooling",
    duration: "Ongoing",
    summary:
      "Set up delivery and quality infrastructure alongside feature work.",
    points: [
      "Set up CI/CD pipelines with GitHub Actions and unit/integration test suites.",
      "Used AI-assisted development tools — GitHub Copilot, Claude Code, Antigravity, Cursor, and custom AI agents — to speed up delivery.",
    ],
  },
];
