import { motion, useMotionValue, useSpring, useTransform, useInView, TargetAndTransition  } from "motion/react";
import { useRef } from "react";
import {
  Code2,
  Database,
  Cloud,
  Smartphone,
  Server,
  GitBranch,
  Terminal,
  Globe,
  Package,
  Layers,
} from "lucide-react";

// ─── Scroll-aware wrapper: animates IN on enter, OUT on leave ─────────────────
function ScrollReveal({
  children,
  hiddenState,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  hiddenState: TargetAndTransition;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 } : hiddenState}
      transition={{
        delay: isInView ? delay : 0,
        duration: 0.65,
        type: "spring",
        stiffness: 75,
        damping: 16,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Tilt + Scroll-out Card ───────────────────────────────────────────────────
function TiltCard({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const isInView = useInView(ref, { once: false, margin: "-80px 0px -80px 0px" });

  const directions = [
    { x: -90, y: -40, r: -4 },
    { x:  90, y: -40, r:  4 },
    { x: -90, y:   0, r: -4 },
    { x:  90, y:   0, r:  4 },
    { x: -90, y:  40, r: -4 },
    { x:  90, y:  40, r:  4 },
  ];
  const dir = directions[index] ?? directions[0];

  return (
    <motion.div
      ref={ref}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
          : { opacity: 0, x: dir.x, y: dir.y, scale: 0.9, rotate: dir.r }
      }
      transition={{
        delay: isInView ? index * 0.09 : 0,
        duration: 0.7,
        type: "spring",
        stiffness: 70,
        damping: 16,
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Skill Tag ────────────────────────────────────────────────────────────────
function SkillTag({ name, index }: { name: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      animate={
        isInView
          ? { opacity: 1, x: 0, filter: "blur(0px)" }
          : { opacity: 0, x: -20, filter: "blur(4px)" }
      }
      transition={{
        delay: isInView ? index * 0.055 : 0,
        duration: 0.45,
        type: "spring",
        stiffness: 130,
        damping: 18,
      }}
      whileHover={{
        x: 10,
        transition: { type: "spring", stiffness: 500, damping: 20 },
      }}
      className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 transition-colors cursor-default"
    >
      <motion.span
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: isInView ? index * 0.055 + 0.15 : 0, type: "spring", stiffness: 300 }}
        className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
      />
      <span className="text-gray-300 group-hover:text-primary transition-colors text-sm font-medium tracking-wide">
        {name}
      </span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      icon: Code2,
      color: "from-red-500 to-red-700",
      skills: [
        { name: "React" }, { name: "TypeScript" }, { name: "Next.js" },
        { name: "Tailwind CSS" }, { name: "Vue.js" }, { name: "HTML/CSS" },
      ],
    },
    {
      category: "Backend",
      icon: Server,
      color: "from-red-600 to-red-900",
      skills: [
        { name: "Node.js" }, { name: "Express.js" }, { name: "Python" },
        { name: "Django" }, { name: "REST APIs" }, { name: "GraphQL" },
      ],
    },
    {
      category: "Database",
      icon: Database,
      color: "from-red-700 to-black",
      skills: [
        { name: "MongoDB" }, { name: "PostgreSQL" }, { name: "MySQL" },
        { name: "Redis" }, { name: "Firebase" }, { name: "Prisma" },
      ],
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      color: "from-red-500 to-red-800",
      skills: [
        { name: "AWS" }, { name: "Google Cloud" }, { name: "Docker" },
        { name: "Kubernetes" }, { name: "CI/CD" }, { name: "Vercel" },
      ],
    },
    {
      category: "Mobile",
      icon: Smartphone,
      color: "from-red-600 to-red-900",
      skills: [
        { name: "React Native" }, { name: "Expo" },
        { name: "Flutter" }, { name: "PWA" },
      ],
    },
    {
      category: "Tools & Others",
      icon: Terminal,
      color: "from-red-700 to-black",
      skills: [
        { name: "Git" }, { name: "VS Code" }, { name: "Figma" },
        { name: "Webpack" }, { name: "Jest" }, { name: "Postman" },
      ],
    },
  ];

  const softSkills = [
    { name: "Problem Solving",    icon: Layers    },
    { name: "Team Collaboration", icon: GitBranch },
    { name: "Communication",      icon: Globe     },
    { name: "Project Management", icon: Package   },
  ];

  return (
    <section id="skills" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-6"
          />
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
            <motion.span
              className="text-white inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Technical
            </motion.span>{" "}
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              Skills
            </motion.span>
          </h1>
          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            A comprehensive overview of my technical expertise and proficiency levels
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-6"
          />
        </motion.div>

        {/* ── Skills Grid ─────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <TiltCard
              key={category.category}
              index={categoryIndex}
              className="p-6 bg-card border border-primary/20 rounded-xl hover:border-primary/50 transition-colors duration-300 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 pointer-events-none rounded-xl"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  className={`p-3 bg-gradient-to-br ${category.color} rounded-lg shadow-lg`}
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <category.icon className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {category.category}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {category.skills.map((skill, skillIndex) => (
                  <SkillTag key={skill.name} name={skill.name} index={skillIndex} />
                ))}
              </div>
            </TiltCard>
          ))}
        </div>

        {/* ── Soft Skills ─────────────────────────────────────────────────── */}
        <ScrollReveal
          hiddenState={{ opacity: 0, y: 30 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
            Soft Skills
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {softSkills.map((skill, index) => (
              <ScrollReveal
                key={skill.name}
                delay={index * 0.1}
                hiddenState={{ opacity: 0, y: 40, scale: 0.85, rotate: -8 }}
                className="p-6 bg-card border border-primary/20 rounded-xl hover:border-primary/50 transition-colors duration-300 text-center group cursor-default"
              >
                <motion.div
                  className="mb-4"
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 350, damping: 12 }}
                >
                  <skill.icon className="w-10 h-10 text-primary mx-auto" />
                </motion.div>
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-3"
                  style={{ width: 0 }}
                  whileHover={{ width: "60%" }}
                  transition={{ duration: 0.3 }}
                />
                <h3 className="text-gray-300 group-hover:text-white transition-colors text-sm font-semibold tracking-wide">
                  {skill.name}
                </h3>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Continuous Learning ─────────────────────────────────────────── */}
        <ScrollReveal hiddenState={{ opacity: 0, y: 40, scale: 0.97 }}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20 rounded-xl text-center overflow-hidden"
          >
            <motion.div
              className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-red-600/20 to-transparent rounded-tl-xl pointer-events-none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-red-600/20 to-transparent rounded-br-xl pointer-events-none"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Continuous Learning
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Technology evolves rapidly, and so do I. I'm committed to staying current with the
              latest tools, frameworks, and best practices. Every project is an opportunity to
              learn something new and refine my craft.
            </p>
          </motion.div>
        </ScrollReveal>

      </div>
    </section>
  );
}