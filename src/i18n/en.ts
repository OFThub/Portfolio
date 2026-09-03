import { enProjects } from "./en.projects";
import { enContact } from "./en.contact";

/**
 * English content — the source of truth for every user-facing string.
 *
 * `tr.ts` is typed against `typeof en`, so adding a key here without adding it
 * there fails the build. Grouped by section: the component that renders a
 * string should be obvious from its path.
 *
 * Deliberately not translated: personal and company names, technology names,
 * and the source code shown in the About terminal.
 */
export const en = {
  language: {
    /** Label for the *other* language, written in that language. */
    switchLabel: "Türkçe",
    switchAria: "Switch language to Turkish",
    current: "English",
  },

  nav: {
    skipToContent: "Skip to main content",
    mainNavAria: "Main navigation",
    menuToggleAria: "Toggle navigation menu",
    home: "Home",
    about: "About",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
  },

  loading: {
    subtitle: "Full Stack Developer",
    nameAria: "Name",
  },

  home: {
    overline: "Portfolio",
    titleLead: "Full Stack",
    titleAccent: "Developer",
    typewriter: [
      "Crafting elegant solutions with modern technologies.",
      "Specializing in end-to-end web development.",
    ],
    ctaWork: "View My Work",
    ctaContact: "Get In Touch",
    scroll: "scroll",
    tech: [
      { label: "Frontend", desc: "React · TypeScript · Tailwind" },
      { label: "Backend", desc: "Node.js · REST · GraphQL" },
      { label: "Database", desc: "PostgreSQL · MongoDB · Redis" },
      { label: "Cloud", desc: "AWS · Docker · CI/CD" },
    ],
    approachOverline: "Approach",
    approachTitleLead: "Turning Ideas Into",
    approachTitleAccent: "Reality",
    pillars: [
      {
        title: "Clean Code",
        description: "Writing maintainable, scalable, and efficient code following best practices.",
      },
      {
        title: "Modern Tech",
        description: "Utilizing cutting-edge technologies and frameworks for optimal solutions.",
      },
      {
        title: "User First",
        description: "Designing intuitive interfaces that prioritize user experience and accessibility.",
      },
    ],
    approachSubtitle:
      "With expertise across the full development stack, I create performant, scalable, and user-centric applications that make an impact.",
    learnMore: "Learn more about me",
  },

  about: {
    overline: "Who I Am",
    titleLead: "About",
    titleAccent: "Me",
    role: "Full Stack Developer",
    terminalFile: "developer.ts",
    terminalLive: "live",
    tagline: "Passionate developer dedicated to creating exceptional digital experiences",
    bio: [
      "I am a passionate full-stack developer with a love for creating beautiful, functional, and user-friendly applications. My journey in Computer Engineering began with a curiosity for how things work and evolved into a career focused on building solutions that make a difference.",
      "With a strong curiosity across all areas of technology, I continuously strive to expand my knowledge and push my boundaries. I enjoy exploring diverse domains, understanding how systems work end to end, and turning ideas into structured, practical solutions.",
      "Passionate about transforming theoretical knowledge into practical applications, consistently exceeding expectations and contributing to team success.",
    ],
    educationTitle: "Education",
    certificationsTitle: "Certifications",
    philosophyTitle: "My Philosophy",
    quote:
      "Coding, like invention, starts with careful observation of the world and turns insight into technology that improves human life.",
    philosophy: [
      "As an engineer, I am driven by the desire to solve real-world problems and make a meaningful impact. I focus on building solutions that reduce repetitive and demanding work, enabling people to dedicate more time to their passions and lead more fulfilling lives.",
      "I believe technology should empower people — not replace them — helping them work more efficiently, create greater value, and ultimately gain more time and financial freedom rather than eliminating opportunities.",
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Engineering",
        institution: "Sakarya University",
        year: "2023 - 2027",
        description:
          "Focused on software development, algorithms, and system design. Graduating with a strong foundation in both hardware and software principles, ready to tackle real-world challenges in the tech industry.",
      },
    ],
    certifications: [
      "Software Persona — Software Development Intern",
      "KOSGEB — Entrepreneurship Training Certificate of Participation",
      "Borusan Technology School Certificate",
      "Borusan School of Equality",
      "Borusan School of Sustainability",
    ],
    traits: [
      { label: "Clean Code", desc: "Maintainable and readable" },
      { label: "Systems Thinking", desc: "End-to-end mindset" },
      { label: "Always Learning", desc: "Curiosity-driven" },
    ],
  },

  skills: {
    overline: "Technical",
    titleLead: "Technical",
    titleAccent: "Skills",
    subtitle: "A comprehensive overview of my technical expertise and proficiency levels",
    softSkillsTitle: "Soft Skills",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      cloud: "Cloud and DevOps",
      mobile: "Mobile",
      tools: "Tools and Others",
    },
    soft: {
      problemSolving: "Problem Solving",
      teamCollaboration: "Team Collaboration",
      communication: "Communication",
      projectManagement: "Project Management",
    },
    continuousLearningTitle: "Continuous Learning",
    continuousLearningBody:
      "Technology evolves rapidly, and so do I. I am committed to staying current with the latest tools, frameworks, and best practices. Every project is an opportunity to learn something new and refine my craft.",
  },

  experience: {
    overline: "Career",
    titleLead: "Work",
    titleAccent: "Experience",
    subtitle: "My professional journey and key achievements in software development",
    achievementsTitle: "Key Achievements",
    stackTitle: "Stack",
    items: [
      {
        title: "Software Developer Intern",
        company: "Software Persona",
        location: "Istanbul, Turkey",
        period: "Jan 2026 - Present",
        type: "Internship",
        description:
          "Completed a multidisciplinary software internship at Software Persona, focusing on UI/UX design, web development, database systems, and mobile application development. Actively participated in project design and production processes within a collaborative development environment.",
        achievements: [
          "Contributed to end-to-end project workflows from design to deployment",
          "Designed and implemented database structures using SQL principles",
          "Developed responsive web interfaces aligned with UI/UX best practices",
          "Participated in mobile application development processes",
          "Collaborated within a structured team-based development environment",
        ],
      },
    ],
  },

  blog: {
    overline: "Articles",
    titleLead: "Tech",
    titleAccent: "Blog",
    subtitle: "Insights, tutorials, and thoughts on web development and technology",
    featuredTitle: "Featured Articles",
    recentTitle: "Recent Articles",
    featuredBadge: "Featured",
    readMore: "Read more",
    comingSoonStatus: "Status",
    comingSoonLead: "Blog",
    comingSoonAccent: "Coming Soon",
    comingSoonBody: "I will be sharing insights and technical articles here soon.",
    inProgress: "In Progress",
  },

  footer: {
    tagline: "Developer Portfolio",
    available: "Available for work",
    quickLinks: "Quick Links",
    more: "More",
    scroll: "scroll",
    quote: [
      "There is always a bigger fish in the sea,",
      "and tomorrow that fish is going to be us.",
    ],
    rightsSuffix: "All rights reserved.",
  },

  projects: {
    overline: "Work",
    titleLead: "Featured",
    titleAccent: "Projects",
    subtitle: "A selection of my recent work showcasing various technologies and solutions",
    featuredBadge: "Featured",
    filterAll: "All",
    githubLinkAria: "Open GitHub repository",
    liveLinkAria: "Open live site",
    moreOnGithub: "More on GitHub",
    autoCategory: "Other",
    ctaTitle: "Want to see more?",
    ctaBody: "Check out my GitHub profile for more projects and contributions",
    ctaButton: "View GitHub Profile",
    items: enProjects,
  },

  contact: enContact,

  errors: {
    githubUnavailable: "Could not load GitHub data",
  },
};
