import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    title: "Make Video Small",
    desc: "A desktop application designed for high-efficiency video compression, providing a clean interface over FFmpeg and Av1an to dramatically reduce video file sizes while maintaining visual quality.",
    subdesc:
      "Built with Electron, React, Node.js, and a Python-based compression engine. Supports AV1 encoding, GPU-accelerated compression, batch processing, live system monitoring, and side-by-side preview of original vs. compressed video.",
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
    title: "ImageAI — AI-Powered Image Editing Platform",
    desc: "A next-gen platform offering advanced image editing using AI: generation, restoration, background removal, and more.",
    subdesc:
      "Built with Next.js 14, TypeScript, Tailwind CSS, and Cloudinary AI, delivering a seamless, responsive experience with powerful AI-backed image transformations.",
    href: "https://imageai-bay.vercel.app/",
    logo: "/assets/project-logo5.png",
    tags: [
      { id: 1, name: "Next.js 14", path: "/assets/nextjs.png" },
      { id: 2, name: "TypeScript", path: "/assets/typescript.png" },
      { id: 3, name: "TailwindCSS", path: "/assets/tailwindcss.png" },
      { id: 4, name: "Cloudinary AI", path: "/assets/cloudinary.png" },
      { id: 5, name: "Clerk", path: "/assets/clerk.png" },
    ],
  },
  {
    title: "CipherSprint — Typing Speed App",
    desc: "An interactive typing speed test application designed to improve typing skills and accuracy, with customizable themes, performance tracking, and detailed analytics.",
    subdesc:
      "Built with React.js, Firebase, and Material-UI with a focus on accessibility and engagement, suitable for typists of all levels.",
    href: "https://ciphersprint.vercel.app/",
    logo: "/assets/project-logo1.svg",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "TailwindCSS", path: "/assets/tailwindcss.png" },
      { id: 3, name: "Firebase", path: "/assets/firebase.png" },
      { id: 4, name: "Framer Motion", path: "/assets/framer.png" },
    ],
  },
  {
    title: "Saffron Stories — A Blog Website",
    desc: "A dynamic blog platform letting users create, read, update, and delete posts, with both day and night modes for a comfortable reading and writing experience.",
    subdesc:
      "Developed with React.js, Firebase, and Tailwind CSS, offering an intuitive interface with secure login and real-time updates.",
    href: "https://saffron-stories.vercel.app/",
    logo: "/assets/project-logo2.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "TailwindCSS", path: "/assets/tailwindcss.png" },
      { id: 3, name: "Firebase", path: "/assets/firebase.png" },
    ],
  },
  {
    title: "Gaberina — A Luxurious E-Commerce Website",
    desc: "A feature-rich e-commerce platform for a seamless shopping experience — browse, buy, and track products effortlessly with an elegant design.",
    subdesc:
      "Built using React.js, Node.js, MongoDB, and Tailwind CSS. Features secure login, payment gateways, and a dynamic admin panel.",
    href: "https://gaberina.vercel.app/",
    logo: "/assets/project-logo3.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 3, name: "MongoDB", path: "/assets/mongodb.svg" },
      { id: 4, name: "TailwindCSS", path: "/assets/tailwindcss.png" },
    ],
  },
  {
    title: "Divine Pellets — Biomass Energy Website",
    desc: "A modern marketing website showcasing sustainable biomass energy solutions, with a clean, professional design for exploring products and getting in touch.",
    subdesc:
      "Built using React.js, Node.js, Tailwind CSS, and Framer Motion, featuring interactive sections, smooth animation, and a fully responsive layout.",
    href: "https://www.divinepellets.com/",
    logo: "/assets/project-logo4.png",
    tags: [
      { id: 1, name: "React.js", path: "/assets/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/nodejs.svg" },
      { id: 3, name: "TailwindCSS", path: "/assets/tailwindcss.png" },
    ],
  },
];
