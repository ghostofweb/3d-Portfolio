import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Newral",
    logo: "/assets/newral.svg",
    location: "Noida, Uttar Pradesh · On-site",
    duration: "Sep 2025 - Present",
    roles: [
      {
        title: "Software Engineer",
        duration: "Jan 2026 - Present",
        summary:
          "Own full-stack delivery on Competishun and Synapse, from query performance and infrastructure cost to the features users see.",
        groups: [
          {
            label: "Competishun",
            description:
              "EdTech platform for JEE/NEET aspirants with 100,000+ active users, served concurrently across a ~9-microservice architecture.",
            points: [
              "Reduced backend CPU usage from ~99% to ~25% through SQL query optimization, Redis caching, and workload restructuring.",
              "Rebuilt the FFmpeg-based video transcoding pipeline, cutting processing time from 6 hours to under 30 minutes.",
              "Cut cloud infrastructure cost by 40% by optimizing SQL queries and consolidating cross-service network calls onto a single network path, shrinking compute footprint from 32 cores to 4.",
              "Led the migration of 9 microservices from GCP to AWS, improving scalability, reliability, and cost efficiency.",
              "Resolved critical production issues across multiple microservices, leading to a ~90% reduction in app crashes.",
            ],
          },
          {
            label: "Synapse",
            href: "https://synappses.in",
            description:
              "Multi-tenant platform for creators and EdTech businesses to sell courses and products and engage their audience. Currently onboarding pilot clients.",
            points: [
              "Building the platform with NestJS, TypeScript, Prisma, and React.",
              "Own architecture decisions for a multi-tenant system serving multiple EdTech businesses from a single codebase.",
            ],
          },
          {
            label: "Client projects",
            description: "Backends for two separate US-based clients.",
            points: [
              "Designed and built the entire backend solo for Upto, a social media application, with NestJS, TypeScript, Prisma, and PostgreSQL.",
              "Modeled the core social data layer (feed, relationships, content) for scale from day one.",
              "Developed a scalable real-time backend with Node.js, Express, Redis, and WebSockets for a separate US-based startup.",
            ],
          },
          {
            label: "Across all projects",
            points: [
              "Set up CI/CD pipelines with GitHub Actions and unit and integration test suites.",
              "Used AI-assisted development tools (GitHub Copilot, Claude Code, Antigravity, Cursor, and custom AI agents) to speed up delivery while maintaining code quality.",
            ],
          },
        ],
      },
      {
        title: "Junior Software Developer Intern",
        duration: "Sep 2025 - Dec 2025",
        groups: [
          {
            points: [
              "Built and maintained microservices using NestJS, TypeScript, PostgreSQL, Redis, and BullMQ.",
              "Handled large-scale data operations across multiple SQL and NoSQL databases.",
              "Resolved production issues across distributed microservices by analyzing application logs, improving system stability and reliability.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    company: "Unite Creatives",
    logo: "/assets/unite-creative.jpg",
    location: "New Delhi, Delhi · Volunteer",
    duration: "Feb 2025 - Oct 2025",
    roles: [
      {
        title: "Programming Challenge Head",
        summary:
          "Volunteer role leading the programming side of a creative community with over 5,000 members.",
        groups: [
          {
            points: [
              "Led coding challenges for the community.",
              "Handled anything coding related for the organization, working mainly with JavaScript and REST APIs.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    company: "Tech Access Learning Pvt Ltd",
    logo: "/assets/tech-access.jpg",
    location: "New Delhi, Delhi · On-site",
    duration: "Jul 2023 - Dec 2023",
    roles: [
      {
        title: "Mobile Application Developer",
        summary: "Worked on native Android and cross-platform mobile apps.",
        groups: [
          {
            points: [
              "Built a local MP3 player in Kotlin (Android Studio) with playlist management and media controls.",
              "Developed a cross-platform movie bookmarking app in React Native with persistent storage.",
              "Learned mobile application architecture across native Android and cross-platform development.",
              "Strengthened debugging and deployment skills, delivering functional mobile apps under tight deadlines.",
            ],
          },
        ],
      },
    ],
  },
];
