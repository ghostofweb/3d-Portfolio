import { Project } from "@/types/project";

export const ownProjects: Project[] = [
  {
    title: "Make Video Small",
    desc: "A desktop app for high-efficiency video compression, providing a clean interface over FFmpeg and Av1an. Electron, React, Node.js, Python.",
    href: "https://makevideosmall.vercel.app/",
    logo: "/assets/project-logo6.png",
    tags: [
      { id: 1, name: "Electron", path: "/assets/electron.svg" },
      { id: 2, name: "React.js", path: "/assets/react.svg" },
      { id: 3, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 4, name: "Python", path: "/assets/python.svg" },
    ],
  },
  {
    title: "ImageAI - AI-Powered Image Editing Platform",
    desc: "A platform for AI-based image generation, restoration, and background removal. Next.js 14, TypeScript, Tailwind CSS, Cloudinary AI.",
    href: "https://imageai-bay.vercel.app/",
    logo: "/assets/project-logo5.png",
    tags: [
      { id: 1, name: "Next.js 14", path: "/assets/nextjs.png" },
      { id: 2, name: "TypeScript", path: "/assets/typescript.png" },
      { id: 3, name: "Cloudinary AI", path: "/assets/cloudinary.png" },
      { id: 4, name: "Clerk", path: "/assets/clerk.png" },
    ],
  },
  {
    title: "CipherSprint - Typing Speed App",
    desc: "An interactive typing speed test with customizable themes and detailed analytics. React.js, Firebase, Material-UI.",
    href: "https://ciphersprint.vercel.app/",
    logo: "/assets/project-logo1.svg",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Firebase", path: "/assets/firebase.png" },
      { id: 3, name: "Framer Motion", path: "/assets/framer.png" },
    ],
  },
  {
    title: "Saffron Stories - A Blog Website",
    desc: "A blog platform for creating, reading, and managing posts, with day and night modes. React.js, Firebase, Tailwind CSS.",
    href: "https://saffron-stories.vercel.app/",
    logo: "/assets/project-logo2.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Firebase", path: "/assets/firebase.png" },
    ],
  },
  {
    title: "Gaberina - A Luxurious E-Commerce Website",
    desc: "A full e-commerce platform with secure login, payments, and a dynamic admin panel. React.js, Node.js, MongoDB.",
    href: "https://gaberina.vercel.app/",
    logo: "/assets/project-logo3.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 3, name: "MongoDB", path: "/assets/mongodb.svg" },
    ],
  },
  {
    title: "Divine Pellets - Biomass Energy Website",
    desc: "A marketing site for a biomass energy company with interactive sections and smooth animation. React.js, Node.js, Framer Motion.",
    href: "https://www.divinepellets.com/",
    logo: "/assets/project-logo4.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/nodejs.svg" },
    ],
  },
];
