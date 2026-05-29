import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Filter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/* ─── Corner Decoration ──────────────────────────────────────────────── */
function CornerDeco({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[position];
  return (
    <motion.div
      className={`absolute w-4 h-4 border-primary/60 ${cls}`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
    />
  );
}

/* ─── Floating Particle ──────────────────────────────────────────────── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/25 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -28, 0], opacity: [0, 0.7, 0], scale: [0, 1.4, 0] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Glitch Text ────────────────────────────────────────────────────── */
function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const run = () => { setGlitching(true); setTimeout(() => setGlitching(false), 180); };
    const id = setInterval(run, 4500 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block">
      {children}
      {glitching && (
        <>
          <span className="absolute inset-0 text-red-400 opacity-70" style={{ clipPath: "inset(0 0 55% 0)", transform: "translateX(-3px)" }}>{children}</span>
          <span className="absolute inset-0 text-cyan-400 opacity-70" style={{ clipPath: "inset(55% 0 0 0)", transform: "translateX(3px)" }}>{children}</span>
        </>
      )}
    </span>
  );
}

/* ─── Scan Line ──────────────────────────────────────────────────────── */
function ScanLine({ duration = 6 }: { duration?: number }) {
  return (
    <motion.div
      className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-20"
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Tech Badge ─────────────────────────────────────────────────────── */
function TechBadge({ label, delay }: { label: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, type: "spring", stiffness: 300 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-xs px-2 py-1 bg-secondary border rounded overflow-hidden cursor-default"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.1)",
        color: hovered ? "rgba(239,68,68,0.9)" : "rgb(209,213,219)",
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      {hovered && (
        <motion.span
          className="absolute inset-0"
          style={{ background: "rgba(239,68,68,0.07)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.span>
  );
}

/* ─── Image Carousel ────────────────────────────────────────────────── */
function ImageCarousel({ images, title, category }: { images: string[]; title: string; category: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Otomatik slayıt
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // 4 saniyede bir

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-52 overflow-hidden group">
      {/* Image Slider */}
      <motion.div
        className="w-full h-full flex"
        animate={{ x: `-${currentImageIndex * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            <ImageWithFallback
              src={img}
              alt={`${title} - Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>
        ))}
      </motion.div>

      {/* Navigation Buttons - REMOVED */}

      {/* Dots Indicator - REMOVED */}

      {/* Bottom Image Label */}
      <motion.div
        className="absolute bottom-2 left-3 z-30"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-xs font-mono text-primary/70 bg-black/60 px-2 py-0.5 rounded border border-primary/20">
          {category}
        </span>
      </motion.div>

      {/* Image Counter - REMOVED */}
    </div>
  );
}

/* ─── Project Card ───────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }, []);

  return (
    <motion.div
      key={project.title}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-card border border-primary/20 rounded-lg overflow-hidden"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.45)" : "rgba(239,68,68,0.2)",
        boxShadow: hovered ? "0 0 40px rgba(239,68,68,0.09)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Mouse spotlight */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: `radial-gradient(200px circle at ${spotX.get()}px ${spotY.get()}px, rgba(239,68,68,0.06) 0%, transparent 70%)` }}
        />
      )}

      <ScanLine duration={7 + index} />
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />

      {/* Featured badge */}
      {project.featured && (
        <motion.div
          className="absolute top-4 right-4 z-30 px-3 py-1 bg-primary text-white text-xs rounded-full font-mono border border-red-400/30"
          initial={{ opacity: 0, scale: 0.7, y: -8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.12 + 0.3, type: "spring", stiffness: 300 }}
          viewport={{ once: true }}
        >
          Featured
        </motion.div>
      )}

      {/* Image Carousel Area */}
      <div className="relative">
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageCarousel images={project.images} title={project.title} category={project.category} />
        </motion.div>

        {/* Hover overlay with links */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center gap-4 z-20"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              {[
                { href: project.github, Icon: Github, label: "GitHub" },
                { href: project.live,   Icon: ExternalLink, label: "Live" },
              ].map(({ href, Icon, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 400 }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 bg-black/80 hover:bg-primary border border-primary/30 hover:border-primary rounded-full transition-colors duration-200 overflow-hidden group/btn"
                >
                  <CornerDeco position="tl" />
                  <Icon className="w-5 h-5 text-white relative z-10" />
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <motion.div
          className="flex items-start justify-between mb-2 gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.12 + 0.25 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-3"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: index * 0.12 + 0.35, duration: 0.8 }}
          viewport={{ once: true }}
        />

        <motion.p
          className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: index * 0.12 + 0.3 }}
          viewport={{ once: true }}
        >
          {project.description}
        </motion.p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech: string, i: number) => (
            <TechBadge key={tech} label={tech} delay={index * 0.12 + 0.4 + i * 0.06} />
          ))}
        </div>
      </div>

      {/* Bottom pulse dot */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/40"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
      />
    </motion.div>
  );
}

/* ─── Magnetic Button ────────────────────────────────────────────────── */
function MagneticBtn({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PROJECTS COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Projects() {
  const [filter, setFilter] = useState("All");

  const projects = [
    {
      title: "Sportify",
      category: "All",
      description:
        "Fitness Center Management and Appointment System",
      images: [
        "images/Sportify-1.png",
        "images/Sportify-2.png",
        "images/Sportify-3.png",
      ],
      technologies: ["C#", "ASP.NET Core MVC", "EF Core", "LINQ", "SQL Server/PostgreSQL", "Bootstrap 5", "JavaScript", "jQuery"],
      github: "https://github.com/OFThub/Sportify",
      live: "",
      featured: true,
    },
    {
      title: "AI Content Platform",
      category: "All",
      description:
        "All-in-one platform for AI-driven content creation and management",
      images: [
        "images/AIContentPlatform-1.png",
        "images/AIContentPlatform-2.png",
        "images/AIContentPlatform-3.png",
      ],
      technologies: ["Next.js", "React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS v4", "Docker", "JWT", "PostCSS"],
      github: "https://github.com/OFThub/AIContentPlatform",
      live: "",
      featured: true,
    },
    {
      title: "Real-Time Task Management System",
      category: "Full-Stack",
      description:
        "A collaborative project management platform featuring real-time synchronization, role-based access control, and interactive Kanban boards.",
      images: [
        "images/todolist-1.png",
        "images/todolist-2.png",
        "images/todolist-3.png",
      ],
      technologies: ["React","Node.js","Express","MongoDB","Socket.IO","JWT","Tailwind CSS","Mongoose"],
      github: "https://github.com/OFThub/ToDoList",
      live: "https://todotoflow.netlify.app/",
      featured: true,
    },
    {
      title: "EventFlowCommerce",
      category: "Microservices",
      description:
        "A production-ready reference implementation of event-driven microservices architecture utilizing DDD, Event Sourcing, CQRS, and the Saga Pattern.",
      images: [
        "images/eventflow-1.png",
        "images/eventflow-2.png",
        "images/eventflow-3.png",
      ],
      technologies: [
        "Node.js",
        "TypeScript",
        "AWS (Lambda, EventBridge, DynamoDB)",
        "Kubernetes",
        "Istio",
        "Docker",
        "Fastify",
        "AWS CDK",
        "CQRS",
        "Event Sourcing"
      ],
      github: "https://github.com/OFThub/EventFlowCommerce",
      live: "",
      featured: true,
    },
    {
      title: "AI Document Simplifier",
      category: "Artificial Intelligence",
      description:
        "It is a fully functional system with a multi-agent architecture designed to solve real-world legal document analysis problems; it simplifies complex texts and performs risk analysis.",
      images: [
        "images/legal-simplifier-1.png",
        "images/legal-simplifier-2.png",
        "images/legal-simplifier-3.png",
      ],
      technologies: [
        "Python",
        "FastAPI",
        "Llama 3 (Ollama)",
        "Multi-Agent Architecture",
        "Vanilla JS",
        "pdfplumber & PyMuPDF",
        "SQLite & JSON Memory",
        "Hybrid Risk Engine (Rule-based + LLM)",
      ],
      github: "https://github.com/OFThub/AIDocumentSimplifier",
      live: "",
      featured: true,
    },
    {
      title: "Online Library Application",
      category: "Full Stack Development",
      description:
      "A comprehensive digital library platform with user, author, and admin roles; featuring book uploading, approval mechanisms, category filtering, and interaction systems (comments, likes, ratings).",
      images: [
      "images/online-library-1.png",
      "images/online-library-2.png",
      "images/online-library-3.png",
      ],
      technologies: [
      "Node.js",
      "Express",
      "MongoDB & Mongoose",
      "JWT (JSON Web Token)",
      "Bcryptjs",
      "Multer",
      "Vanilla JS",
      "CSS3 (Responsive Design)",
      ],
      github: "https://github.com/OFThub/OnlineLibrary",
      live: "",
      featured: true,
    },
    {
      title: "Limited-Stock Product Drop System",
      category: "Full Stack Development / Backend Engineering",
      description:
      "A sophisticated reservation system designed for high-traffic product launches, preventing stock errors (race conditions) with PostgreSQL's 'SELECT FOR UPDATE' locking mechanism. It ensures 100% stock accuracy, automatic reservation time management, and detailed inventory audit trails.",
      images: [
      "images/drop-system-1.png",
      "images/drop-system-2.png",
      "images/drop-system-3.png",
      ],
      technologies: [
      "Node.js",
      "TypeScript",
      "Express",
      "Prisma ORM",
      "PostgreSQL (Pessimistic Locking)",
      "JWT (JSON Web Token)",
      "Node-cron",
      "Winston (Structured Logging)",
      "Vite & React",
      ],
      github: "https://github.com/OFThub/DropSystem",
      live: "https://drop-system.pxxl.app",
      featured: true,
    },
    {
      title: "tarsau - File Archiving Tool",
      category: "System Programming / File Management",
      description:
      "A file archiving program that works like tar, rar, and zip but does not compress files. It concatenates text files into a single .sau archive file and extracts them. Compiled with the 'make' command. The concatenation process is performed with 'tarsau -b file1 file2 ... -o archive.sau', and the extraction process is done with 'tarsau -a archive.sau [target_directory]'. The archive file consists of an organization section containing the total size and pipe (|) separated file names, permissions, and sizes, followed by the content sections of the files in order. A single archive can contain up to 32 files, with a total size not exceeding 200 MB, and only ASCII text files are supported. Development stages can be tracked through the commit history.",
      images: [],
      technologies: [
      "Make",
      ],
      github: "",
      live: "",
      featured: true,
    },
    {
      title: "Algan AI Chatbot",
      category: "All",
      description:
        "Modular AI Chatbot system with dynamic mode switching that operates via voice commands.",
      images: [
        "images/AlganAIChatbot-1.png",
        "images/AlganAIChatbot-2.png",
        "images/AlganAIChatbot-3.png",
      ],
      technologies: ["Python", "Claude API", "OpenAI Whisper", "OpenAI TTS", "Pydantic", "asyncio", "MongoDB", "PostgreSQL", "Web Speech API", "Faster-Whisper", "Docker"],
      github: "https://github.com/OFThub/Project-Algan",
      live: "",
      featured: true,
    },
    {
      title: "Sudoku Game",
      category: "All",
      description:
        "Cross-platform Sudoku game running seamlessly on both web browsers and as a standalone desktop application (.exe) with real-time cell validation and instant completion feedback.",
      images: [
        "images/Sudoku-1.png",
        "images/Sudoku-2.png",
        "images/Sudoku-3.png",
      ],
      technologies: ["Python", "Pygame", "Pyinstaller", "WebAssembly"],
      github: "https://github.com/OFThub/Sudoku",
      live: "",
      featured: true,
    },
    {
      title: "SmashMate — Minesweeper Edition",
      category: "Mobile",
      description:
        "A fully-featured, expertly-crafted Minesweeper game built with React Native and Expo (SDK 52), using Expo Router for seamless navigation. Features first-click safety, BFS chain-reveal, light/dark themes, haptic feedback, and smooth Reanimated animations.",
      images: [
        "images/Minesweeper-1.png",
        "images/Minesweeper-2.png",
        "images/Minesweeper-3.png",
      ],
      technologies: [
        "React Native",
        "Expo",
        "Expo Router",
        "TypeScript",
        "React Native Reanimated",
        "AsyncStorage"
      ],
      github: "https://github.com/OFThub/SmashMate-Mobile",
      live: "",
      featured: true,
    },
    {
      title: "Full Stack Developer Portfolio",
      category: "Web",
      description:
        "A breathtaking single-page portfolio website built with React, TypeScript, and Tailwind CSS featuring a stunning black and red color scheme with smooth scrolling navigation. Features a dark theme, Motion animations, fully responsive design, and comprehensive sections including a Hero section with Spline 3D integration area, About, Skills, Experience, Projects, Blog, and a Contact form.",
      images: [
        "images/Portfolio-1.png",
        "images/Portfolio-2.png",
        "images/Portfolio-3.png",
      ],
      technologies: [
        "React 18",
        "TypeScript",
        "Tailwind CSS v4",
        "Motion (Framer Motion)",
        "Lucide React Icons",
        "Vite"
      ],
      github: "https://github.com/OFThub/Full-Stack-Developer-Portfolio",
      live: "",
      featured: true,
    },
    {
      title: "SmashMate File Manager — REST Service",
      category: "Backend",
      description:
        "A RESTful file management service built with Java 21 and Spring Boot 3.4.4 that stores files in Cloudflare R2 object storage, manages metadata in H2, and provides image thumbnail previews. Features single & batch file upload via multipart form data, file download with correct content-type/content-disposition headers, auto-generated 200×200 JPEG thumbnail previews via Thumbnailator (with R2 caching), and structured JSON metadata previews for non-image files. Includes paginated file listing, file validation, global error handling, and Swagger/OpenAPI documentation.",
      images: [
        "images/SmashMate-1.png",
        "images/SmashMate-2.png",
        "images/SmashMate-3.png"
      ],
      technologies: [
        "Java 21",
        "Spring Boot 3.4.4",
        "Maven",
        "Cloudflare R2 (AWS SDK v2)",
        "H2 Database",
        "Spring Data JPA",
        "Thumbnailator 0.4.21",
        "SpringDoc OpenAPI 2.8.6",
        "JUnit 5",
        "Mockito",
        "Docker"
      ],
      github: "https://github.com/YOUR_USERNAME/SmashMate-Backend.git",
      live: "",
      featured: true
    },
  ];

  const categories = ["All"];

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
  }));

  return (
    <section id="projects" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }}
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <motion.div className="flex items-center justify-center gap-4 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">Work</span>
            <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span className="text-white inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>Featured{" "}</motion.span>
            <motion.span className="text-primary inline-block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <GlitchText>Projects</GlitchText>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
            A selection of my recent work showcasing various technologies and solutions
          </motion.p>

          <motion.div className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ delay: 0.9, duration: 1 }} />
        </motion.div>

        {/* ── Filter ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-12 flex-wrap"
        >
          <motion.div
            className="p-2 bg-primary/10 border border-primary/30 rounded-lg"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.2)" }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Filter className="w-4 h-4 text-primary" />
          </motion.div>

          {categories.map((category, i) => (
            <motion.button
              key={category}
              onClick={() => setFilter(category)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.07, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`relative px-5 py-2 rounded-lg text-sm font-mono transition-colors duration-200 overflow-hidden`}
              style={{
                background: filter === category ? "rgb(239,68,68)" : "transparent",
                color: filter === category ? "white" : "rgb(156,163,175)",
                border: `1px solid ${filter === category ? "transparent" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {filter === category && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ x: ["−100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Projects Grid ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative mt-16 p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center overflow-hidden"
        >
          <CornerDeco position="tl" />
          <CornerDeco position="tr" />
          <CornerDeco position="bl" />
          <CornerDeco position="br" />
          <ScanLine duration={9} />

          {/* BG pulse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.h2
              className="text-3xl font-bold text-white mb-3"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}
            >
              Want to see more?
            </motion.h2>

            <motion.p
              className="text-gray-400 mb-6 font-mono text-sm"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}
            >
              Check out my GitHub profile for more projects and contributions
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              viewport={{ once: true }}
            >
              <MagneticBtn
                href="https://github.com/OFThub/"
                className="relative inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors duration-300 overflow-hidden group font-mono text-sm"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ x: ["−100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
                <Github className="w-5 h-5 relative z-10" />
                <span className="relative z-10">View GitHub Profile</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ↗
                </motion.span>
              </MagneticBtn>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}