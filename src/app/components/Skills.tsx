import { motion } from "motion/react";
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
  Layers
} from "lucide-react";

export function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      icon: Code2,
      color: "from-red-600 to-red-800",
      skills: [
        { name: "React", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Next.js", level: 88 },
        { name: "Tailwind CSS", level: 92 },
        { name: "Vue.js", level: 85 },
        { name: "HTML/CSS", level: 95 },
      ],
    },
    {
      category: "Backend",
      icon: Server,
      color: "from-red-700 to-red-900",
      skills: [
        { name: "Node.js", level: 92 },
        { name: "Express.js", level: 90 },
        { name: "Python", level: 85 },
        { name: "Django", level: 82 },
        { name: "REST APIs", level: 93 },
        { name: "GraphQL", level: 87 },
      ],
    },
    {
      category: "Database",
      icon: Database,
      color: "from-red-800 to-black",
      skills: [
        { name: "MongoDB", level: 90 },
        { name: "PostgreSQL", level: 88 },
        { name: "MySQL", level: 85 },
        { name: "Redis", level: 82 },
        { name: "Firebase", level: 87 },
        { name: "Prisma", level: 85 },
      ],
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      color: "from-red-600 to-red-800",
      skills: [
        { name: "AWS", level: 88 },
        { name: "Google Cloud", level: 85 },
        { name: "Docker", level: 90 },
        { name: "Kubernetes", level: 80 },
        { name: "CI/CD", level: 87 },
        { name: "Vercel", level: 92 },
      ],
    },
    {
      category: "Mobile",
      icon: Smartphone,
      color: "from-red-700 to-red-900",
      skills: [
        { name: "React Native", level: 88 },
        { name: "Expo", level: 85 },
        { name: "Flutter", level: 75 },
        { name: "PWA", level: 90 },
      ],
    },
    {
      category: "Tools & Others",
      icon: Terminal,
      color: "from-red-800 to-black",
      skills: [
        { name: "Git", level: 95 },
        { name: "VS Code", level: 95 },
        { name: "Figma", level: 87 },
        { name: "Webpack", level: 83 },
        { name: "Jest", level: 88 },
        { name: "Postman", level: 90 },
      ],
    },
  ];

  const softSkills = [
    { name: "Problem Solving", icon: Layers },
    { name: "Team Collaboration", icon: GitBranch },
    { name: "Communication", icon: Globe },
    { name: "Project Management", icon: Package },
  ];

  return (
    <section id="skills" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">Technical</span>{" "}
            <span className="text-primary">Skills</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-br ${category.color} rounded-lg`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: skillIndex * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-primary text-sm font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ delay: skillIndex * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-red-700 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Soft Skills</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="p-6 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 text-center group"
              >
                <skill.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-gray-300">{skill.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Overview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Continuous Learning</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Technology evolves rapidly, and so do I. I'm committed to staying current with the 
            latest tools, frameworks, and best practices. Every project is an opportunity to 
            learn something new and refine my craft.
          </p>
        </motion.div>
      </div>
    </section>
  );
}