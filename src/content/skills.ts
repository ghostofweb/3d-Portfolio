export interface SkillGroup {
  category: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages & Frameworks",
    items: [
      "TypeScript",
      "JavaScript",
      "Node.js",
      "NestJS",
      "Express",
      "React",
      "Next.js",
      "Python",
    ],
  },
  {
    category: "Databases & ORMs",
    items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "TypeORM"],
  },
  {
    category: "UI",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Infrastructure & Cloud",
    items: ["AWS", "GCP", "Docker"],
  },
  {
    category: "DevOps",
    items: [
      "Git",
      "GitHub Actions",
      "CI/CD pipelines",
      "Monitoring",
      "Production deployment",
    ],
  },
  {
    category: "Realtime & Media",
    items: [
      "Redis",
      "BullMQ",
      "WebRTC",
      "Video transcoding",
      "DRM",
      "Batching & queues",
      "Caching",
    ],
  },
  {
    category: "Storage",
    items: ["AWS S3", "Appwrite", "GCP Storage", "Cloudinary"],
  },
  {
    category: "Payments",
    items: ["Razorpay", "Stripe"],
  },
  {
    category: "Monitoring",
    items: ["Prometheus", "Grafana"],
  },
  {
    category: "Design & Productivity",
    items: ["Figma", "Canva", "Notion"],
  },
  {
    category: "AI Tools",
    items: [
      "GitHub Copilot",
      "Claude Code",
      "Antigravity",
      "Cursor",
      "Custom AI agents",
    ],
  },
];
