import { Experience } from "@/types/experience";

export const experiences: Experience[] = [
  {
    id: 1,
    name: "Newral.in",
    pos: "Full Stack Developer",
    duration: "Sept 2025 — Present",
    summary:
      "Contributing to a large-scale production EdTech platform serving tens of thousands of active users, focused on backend performance, infrastructure efficiency, and video processing pipelines.",
    points: [
      "Developed and optimized backend microservices using NestJS, TypeScript, PostgreSQL, Redis, BullMQ, Pub/Sub, TypeORM, and Cloud SQL.",
      "Refactored SQL queries with indexing, caching, and restructuring, reducing overall CPU utilization by ~80–85%.",
      "Redesigned the video upload and transcoding pipeline using FFmpeg, achieving over 80% faster video processing.",
      "Reduced infrastructure resource usage by optimizing compute and GPU workloads while maintaining reliability.",
      "Resolved critical production issues across multiple microservices, leading to a ~90% reduction in app crashes.",
      "Optimized inter-service communication, reducing unnecessary Pub/Sub calls and cross-service overhead.",
      "Worked on backend features involving large datasets and multi-database operations with a focus on scalability.",
      "Collaborated on frontend integrations using React.js for seamless backend-frontend data flow.",
    ],
    icon: "/assets/newral.svg",
  },
];
