import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Filter, Star } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useGitHubRepos } from "../../hooks/useGitHubRepos";
import type { GitHubRepo } from "../../services/github";
import { CountUp } from "./Kinetic";
import { MatrixRain } from "./effects/MatrixRain";
import { useI18n } from "../../i18n";

/* Vite's base path, always with a trailing slash. Files in public/ referenced
   from JS must go through this or they break on a sub-path deployment. */
const BASE = import.meta.env.BASE_URL;

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
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => setH(parent.clientHeight));
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-20"
      animate={h > 0 ? { y: [0, h] } : {}}
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
  const rootRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);

  // Otomatik slayt — yalnızca kart görünürken ve birden fazla resim varken
  useEffect(() => {
    if (images.length <= 1) return;
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    observer.observe(el);

    const interval = setInterval(() => {
      if (!inViewRef.current || document.hidden) return;
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // 4 saniyede bir

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [images.length]);

  return (
    <div ref={rootRef} className="relative h-52 overflow-hidden group">
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
function ProjectCard({ project, index }: { project: EnrichedProject; index: number }) {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={project.key}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="spotlight group relative bg-card border border-primary/20 rounded-lg overflow-hidden"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.45)" : "rgba(239,68,68,0.2)",
        boxShadow: hovered ? "0 0 40px rgba(239,68,68,0.09)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
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
          {t.projects.featuredBadge}
        </motion.div>
      )}

      {/* Image Carousel Area */}
      <div className="relative">
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageCarousel images={project.images.map((src) => BASE + src)} title={project.title} category={project.category} />
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
                { href: project.github, Icon: Github, label: t.projects.githubLinkAria },
                { href: project.live,   Icon: ExternalLink, label: t.projects.liveLinkAria },
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
                  className="spotlight relative p-3 bg-black/80 hover:bg-primary border border-primary/30 hover:border-primary rounded-full transition-colors duration-200 overflow-hidden group/btn"
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
          {project.stars > 0 && (
            <span className="flex items-center gap-1 text-xs text-yellow-400 shrink-0 mt-1">
              <Star className="w-3 h-3 fill-current" />
              <CountUp value={project.stars} />
            </span>
          )}
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
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`spotlight ${className}`}
    >
      {children}
    </motion.a>
  );
}

/* ─── GitHub helpers ─────────────────────────────────────────────────── */
/** Everything about a project that is the same in every language. */
type RawProject = {
  key: string;
  images: string[];
  technologies: string[];
  github: string;
  live: string;
  featured: boolean;
};

/** The translated half, looked up by `key` in the dictionary. */
type ProjectCopy = {
  title: string;
  category: string;
  description: string;
};

type EnrichedProject = RawProject & ProjectCopy & {
  stars: number;
  forks: number;
  updatedAt: string | null;
};

function extractRepoName(githubUrl: string): string | null {
  if (!githubUrl) return null;
  const parts = githubUrl.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

function enrichProject(
  project: RawProject,
  copy: ProjectCopy,
  githubRepos: GitHubRepo[],
): EnrichedProject {
  const repoName = extractRepoName(project.github);
  const match = repoName
    ? githubRepos.find((r) => r.name.toLowerCase() === repoName.toLowerCase())
    : null;
  return {
    ...project,
    ...copy,
    stars: match?.stargazers_count ?? 0,
    forks: match?.forks_count ?? 0,
    updatedAt: match?.updated_at ?? null,
    live: project.live || match?.homepage || "",
  };
}

function buildAutoDiscoveredProjects(
  githubRepos: GitHubRepo[],
  portfolioProjects: RawProject[],
  autoCategory: string,
): EnrichedProject[] {
  const portfolioRepoNames = new Set(
    portfolioProjects
      .map((p) => extractRepoName(p.github)?.toLowerCase())
      .filter(Boolean)
  );

  return githubRepos
    .filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        repo.language !== null &&
        !portfolioRepoNames.has(repo.name.toLowerCase())
    )
    .map((repo) => ({
      key: repo.name,
      title: repo.name.replace(/-/g, " ").replace(/_/g, " "),
      category: autoCategory,
      description: repo.description ?? "",
      images: [] as string[],
      technologies: ([repo.language!, ...repo.topics]).filter(Boolean),
      github: repo.html_url,
      live: repo.homepage ?? "",
      featured: false,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
    }));
}

/* ─── Portfolio projects ─────────────────────────────────────────────
   Module scope on purpose: this is static data, so keeping it out of the
   component body means the useMemo dependency lists below are honest. */
const RAW_PROJECTS: RawProject[] = [
  {
    key: "sportify",
    images: ["images/Sportify-1.jpg", "images/Sportify-2.jpg", "images/Sportify-3.jpg"],
    technologies: [
      "C#",
      "ASP.NET Core MVC",
      "EF Core",
      "LINQ",
      "SQL Server/PostgreSQL",
      "Bootstrap 5",
      "JavaScript",
      "jQuery",
    ],
    github: "https://github.com/OFThub/Sportify",
    live: "",
    featured: true,
  },
  {
    key: "aiContentPlatform",
    images: ["images/AIContentPlatform-1.jpg", "images/AIContentPlatform-2.jpg", "images/AIContentPlatform-3.jpg"],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Tailwind CSS v4",
      "Docker",
      "JWT",
      "PostCSS",
    ],
    github: "https://github.com/OFThub/AIContentPlatform",
    live: "",
    featured: true,
  },
  {
    key: "taskManagement",
    images: ["images/todolist-1.jpg", "images/todolist-2.jpg", "images/todolist-3.jpg"],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "JWT",
      "Tailwind CSS",
      "Mongoose",
    ],
    github: "https://github.com/OFThub/ToDoList",
    live: "https://todotoflow.netlify.app/",
    featured: true,
  },
  {
    key: "eventFlowCommerce",
    images: ["images/eventflow-1.jpg", "images/eventflow-2.jpg", "images/eventflow-3.jpg"],
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
      "Event Sourcing",
    ],
    github: "https://github.com/OFThub/EventFlowCommerce",
    live: "",
    featured: true,
  },
  {
    key: "documentSimplifier",
    images: ["images/legal-simplifier-1.jpg", "images/legal-simplifier-2.jpg", "images/legal-simplifier-3.jpg"],
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
    key: "onlineLibrary",
    images: ["images/online-library-1.jpg", "images/online-library-2.jpg", "images/online-library-3.jpg"],
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
    key: "dropSystem",
    images: ["images/drop-system-1.jpg", "images/drop-system-2.jpg", "images/drop-system-3.jpg"],
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
    key: "tarsau",
    images: [],
    technologies: ["Make"],
    github: "",
    live: "",
    featured: true,
  },
  {
    key: "alganChatbot",
    images: ["images/AlganAIChatbot-1.jpg", "images/AlganAIChatbot-2.jpg", "images/AlganAIChatbot-3.jpg"],
    technologies: [
      "Python",
      "Claude API",
      "OpenAI Whisper",
      "OpenAI TTS",
      "Pydantic",
      "asyncio",
      "MongoDB",
      "PostgreSQL",
      "Web Speech API",
      "Faster-Whisper",
      "Docker",
    ],
    github: "https://github.com/OFThub/Project-Algan",
    live: "",
    featured: true,
  },
  {
    key: "sudoku",
    images: ["images/Sudoku-1.jpg", "images/Sudoku-2.jpg", "images/Sudoku-3.jpg"],
    technologies: ["Python", "Pygame", "Pyinstaller", "WebAssembly"],
    github: "https://github.com/OFThub/Sudoku",
    live: "",
    featured: true,
  },
  {
    key: "smashMateMinesweeper",
    images: ["images/Minesweeper-1.jpg", "images/Minesweeper-2.jpg", "images/Minesweeper-3.jpg"],
    technologies: [
      "React Native",
      "Expo",
      "Expo Router",
      "TypeScript",
      "React Native Reanimated",
      "AsyncStorage",
    ],
    github: "https://github.com/OFThub/SmashMate-Mobile",
    live: "",
    featured: true,
  },
  {
    key: "portfolio",
    images: ["images/Portfolio-1.jpg", "images/Portfolio-2.jpg", "images/Portfolio-3.jpg"],
    technologies: [
      "React 18",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion (Framer Motion)",
      "Lucide React Icons",
      "Vite",
    ],
    github: "https://github.com/OFThub/Full-Stack-Developer-Portfolio",
    live: "",
    featured: true,
  },
  {
    key: "smashMateFileManager",
    images: ["images/SmashMate-1.jpg", "images/SmashMate-2.jpg", "images/SmashMate-3.jpg"],
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
      "Docker",
    ],
    github: "https://github.com/OFThub/SmashMate-Backend",
    live: "",
    featured: true,
  },
  {
    key: "miniKatalog",
    images: ["images/MiniKatalog-1.jpg", "images/MiniKatalog-2.jpg", "images/MiniKatalog-3.jpg"],
    technologies: ["Flutter SDK 3.x", "Dart SDK 3.x", "http ^1.1.0", "material.dart", "FakeStore API"],
    github: "https://github.com/OFThub/SoftwarePersona-Mobil",
    live: "",
    featured: true,
  },
  {
    key: "planetSimulation",
    images: ["images/GezegenSimulasyon-1.jpg", "images/GezegenSimulasyon-2.jpg", "images/GezegenSimulasyon-3.jpg"],
    technologies: [
      "C Dili",
      "MinGW GCC Compiler",
      "Makefile",
      "Object-Oriented C (OOP Simulation)",
      "File I/O (Data Parsing)",
    ],
    github: "https://github.com/OFThub/UzayProgramC",
    live: "",
    featured: true,
  },
  {
    key: "mnist",
    images: ["images/mnist-1.jpg", "images/mnist-2.jpg"],
    technologies: ["Python", "HTML", "JavaScript"],
    github: "",
    live: "",
    featured: false,
  },
  {
    key: "trafficAnalysis",
    images: ["images/traffic-1.jpg", "images/traffic-2.jpg"],
    technologies: ["Python", "OpenCV", "YOLO"],
    github: "",
    live: "",
    featured: false,
  },
  {
    key: "matrixPointer",
    images: ["images/matrix-1.jpg"],
    technologies: ["C", "Pointer Arithmetic", "Dynamic Memory Allocation (malloc)"],
    github: "https://github.com/OFThub/SisProg",
    live: "",
    featured: false,
  },
  {
    key: "oftify",
    images: ["images/sarkievreni-1.jpg"],
    technologies: [
      "React Native",
      "Zustand",
      "react-native-track-player",
      "react-native-fs",
      "react-native-reanimated",
      "AsyncStorage",
    ],
    github: "https://github.com/OFThub/OFTify",
    live: "",
    featured: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PROJECTS COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Projects() {
  const { t } = useI18n();
  /* The filter value is the untranslated key; only its button label is localised. */
  const [filter, setFilter] = useState("All");
  const { repos: githubRepos } = useGitHubRepos();

  const categories = ["All"];

  const enrichedProjects = useMemo(
    () =>
      RAW_PROJECTS.map((p) =>
        enrichProject(p, t.projects.items[p.key as keyof typeof t.projects.items], githubRepos),
      ).sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars;
        const dateA = new Date(a.updatedAt ?? 0).getTime();
        const dateB = new Date(b.updatedAt ?? 0).getTime();
        return dateB - dateA;
      }),
    [githubRepos, t]
  );

  const autoDiscovered = useMemo(
    () => buildAutoDiscoveredProjects(githubRepos, RAW_PROJECTS, t.projects.autoCategory),
    [githubRepos, t]
  );

  const filteredProjects =
    filter === "All" ? enrichedProjects : enrichedProjects.filter((p) => p.category === filter);

  const particles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
    })),
    []
  );

  return (
    <section id="projects" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Kırmızı Matrix yağmuru (yukarıdan düşen rastgele karakterler) */}
        <MatrixRain />
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
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">{t.projects.overline}</span>
            <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span className="text-white inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>{t.projects.titleLead}{" "}</motion.span>
            <motion.span className="text-primary inline-block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <GlitchText>{t.projects.titleAccent}</GlitchText>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
            {t.projects.subtitle}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`spotlight relative px-5 py-2 rounded-lg text-sm font-mono transition-colors duration-200 overflow-hidden`}
              style={{
                background: filter === category ? "rgb(239,68,68)" : "transparent",
                color: filter === category ? "white" : "rgb(156,163,175)",
                border: `1px solid ${filter === category ? "transparent" : "rgba(239,68,68,0.2)"}`,
              }}
            >
              {filter === category && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
              {/* The value stays "All"; only the label is localised. */}
              <span className="relative z-10">{category === "All" ? t.projects.filterAll : category}</span>
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
              <ProjectCard key={project.key} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── More on GitHub ── */}
        {autoDiscovered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-xl font-semibold text-white/50 mb-6 text-center font-mono tracking-widest uppercase text-sm">
              {t.projects.moreOnGithub}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {autoDiscovered.map((repo) => (
                <a
                  key={repo.github}
                  href={repo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight relative border border-white/10 rounded-lg p-4 hover:border-red-600/40 transition-colors group bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-white/80 group-hover:text-red-400 transition-colors text-sm capitalize">
                      {repo.title}
                    </h4>
                    {repo.stars > 0 && (
                      <span className="text-xs text-yellow-400 flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 fill-current" /> <CountUp value={repo.stars} />
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {repo.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="spotlight relative mt-16 p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center overflow-hidden"
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
              {t.projects.ctaTitle}
            </motion.h2>

            <motion.p
              className="text-gray-400 mb-6 font-mono text-sm"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}
            >
              {t.projects.ctaBody}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              viewport={{ once: true }}
            >
              <MagneticBtn
                href="https://github.com/OFThub/"
                className="relative inline-flex items-center gap-2 px-6 py-3 glass-red text-white rounded-lg overflow-hidden group font-mono text-sm"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
                <Github className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t.projects.ctaButton}</span>
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