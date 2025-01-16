export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'Contact',
    href: '#contact',
  },
];

  export const clientReviews = [
    {
      id: 1,
      name: 'Emily Johnson',
      position: 'Marketing Director at GreenLeaf',
      img: 'assets/review1.png',
      review:
        'Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
    },
    {
      id: 2,
      name: 'Mark Rogers',
      position: 'Founder of TechGear Shop',
      img: 'assets/review2.png',
      review:
        'Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional! Fantastic work.',
    },
    {
      id: 3,
      name: 'John Dohsas',
      position: 'Project Manager at UrbanTech ',
      img: 'assets/review3.png',
      review:
        'I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
    },
    {
      id: 4,
      name: 'Ether Smith',
      position: 'CEO of BrightStar Enterprises',
      img: 'assets/review4.png',
      review:
        'Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
    },
  ];
  
  export const myProjects = [
    {
        title: 'CipherSprint - Typing Speed App',
        desc: 'CipherSprint is an interactive typing speed test application designed to improve typing skills and accuracy. It offers features such as customizable themes, performance tracking, and detailed analytics to monitor progress over time.',
        subdesc: 'This app leverages modern technologies like React.js, Firebase, and Material-UI to create a seamless user experience. Built with a focus on accessibility and engagement, CipherSprint is perfect for typists of all levels.',
        href: 'https://ciphersprint.vercel.app/',
        texture: '/textures/project/project1.mp4',
        logo: '/assets/project-logo1.svg',
        logoStyle: {
    border: '0.2px solid #A8DDA8', // Softer green border for a refined touch
    boxShadow: '0px 0px 20px 0px #A6FBA633', // Subtle glow, less intense
},
        spotlight: '/assets/spotlight1.png',
        tags: [
            { id: 1, name: 'React.js', path: '/assets/react.svg' },
            { id: 2, name: 'TailwindCSS', path: 'assets/tailwindcss.png' },
            { id: 3, name: 'Firebase', path: '/assets/firebase.png' },
            { id: 4, name: 'Framer Motion', path: '/assets/framer.png' },
        ],
    },
    {
        title: 'Saffron Stories - A Blog Website',
        desc: 'Saffron Stories is a dynamic blog platform that allows users to create, read, update, and delete blogs effortlessly. The website supports both day and night modes, providing a comfortable reading and writing experience for all users.',
        subdesc: 'Developed using React.js, Firebase, and TailwindCSS, Saffron Stories offers an intuitive interface with a secure login system and real-time updates. Perfect for writers and readers alike, it brings creativity and technology together in harmony.',
        href: 'https://saffron-stories.vercel.app/',
        texture: '/textures/project/project2.mp4',
        logo: '/assets/project-logo2.png',
        logoStyle: {
            backgroundColor: '#13202F',
            border: '0.2px solid #17293E',
            boxShadow: '0px 0px 60px 0px #2F6DB54D',
        },
        spotlight: '/assets/spotlight2.png',
        tags: [
            { id: 1, name: 'React.js', path: '/assets/react.svg' },
            { id: 2, name: 'TailwindCSS', path: 'assets/tailwindcss.png' },
            { id: 3, name: 'Firebase', path: '/assets/firebase.png' }
        ],
    },{
      "title": "Gaberina - A Luxurious E-Commerce Website",
      "desc": "Gaberina is a feature-rich e-commerce platform designed to provide a seamless shopping experience. With an elegant design and robust functionality, users can browse, buy, and track products effortlessly.",
      "subdesc": "Built using React.js, Node.js, MongoDB, and TailwindCSS, Gaberina features secure login, payment gateways, and a dynamic admin panel. It's a complete solution for managing and experiencing online shopping.",
      "href": "https://gaberina.vercel.app/",
      "texture": "/textures/project/project3.mp4",
      "logo": "/assets/project-logo3.png",
      "logoStyle": {
        "backgroundColor": "#1C1C1C",
        "border": "0.2px solid #D4AF37",
        "boxShadow": "0px 0px 60px 0px #D4AF37"
      },
      "spotlight": "/assets/spotlight3.png",
      "tags": [
          { "id": 1, "name": "React.js", "path": "/assets/react.svg" },
          { "id": 2, "name": "Node.js", "path": "/assets/nodejs.svg" },
          { "id": 3, "name": "MongoDB", "path": "/assets/mongodb.svg" },
          { "id": 4, "name": "TailwindCSS", "path": "/assets/tailwindcss.png" }
      ]
  },{
    "title": "Divine Pellets - Biomass Energy Website",
    "desc": "Divine Pellets is a modern website showcasing sustainable biomass energy solutions. With a clean and professional design, users can explore products, learn about biomass benefits, and get in touch effortlessly.",
    "subdesc": "Built using React.js, Node.js, TailwindCSS, and Framer Motion, the platform features interactive sections, smooth animations, and a responsive design, offering an engaging and informative user experience.",
    "href": "https://www.divinepellets.com/",
    "texture": "/textures/project/project4.mp4",
    "logo": "/assets/project-logo4.png",
    "logoStyle": {
      "backgroundColor": "#FFFFFF",
      "border": "0.2px solid #1B392F",
      "boxShadow": "0px 0px 40px 0px #1B392F"
    },
    "spotlight": "/assets/spotlight4.png",
    "tags": [
      { "id": 1, "name": "React.js", "path": "/assets/react.svg" },
      { "id": 2, "name": "Node.js", "path": "/assets/nodejs.svg" },
      { "id": 3, "name": "TailwindCSS", "path": "/assets/tailwindcss.png" },
    ]
  }
  
  
];

  
  export const calculateSizes = (isSmall, isMobile, isTablet) => {
    return {
      deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
      deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
      cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
      reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
      ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
      targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
    };
  };
  
  export const workExperiences = [
    {
      id: 1,
      name: 'Framer',
      pos: 'Lead Web Developer',
      duration: '2022 - Present',
      title: "Framer serves as my go-to tool for creating interactive prototypes. I use it to bring designs to  life, allowing stakeholders to experience the user flow and interactions before development.",
      icon: '/assets/framer.svg',
      animation: 'victory',
    },
    {
      id: 2,
      name: 'Figma',
      pos: 'Web Developer',
      duration: '2020 - 2022',
      title: "Figma is my collaborative design platform of choice. I utilize it to work seamlessly with team members and clients, facilitating real-time feedback and design iterations. Its cloud-based.",
      icon: '/assets/figma.svg',
      animation: 'clapping',
    },
    {
      id: 3,
      name: 'Notion',
      pos: 'Junior Web Developer',
      duration: '2019 - 2020',
      title: "Notion helps me keep my projects organized. I use it for project management, task tracking, and as a central hub for documentation, ensuring that everything from design notes to.",
      icon: '/assets/notion.svg',
      animation: 'salute',
    },
  ];