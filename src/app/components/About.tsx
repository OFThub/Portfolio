import { motion } from "motion/react";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const education = [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University Name",
      year: "2018 - 2022",
      description: "Graduated with honors. Specialized in Software Engineering and Web Technologies.",
    },
    {
      degree: "Full Stack Web Development Bootcamp",
      institution: "Coding Academy",
      year: "2022",
      description: "Intensive program covering modern web development practices and frameworks.",
    },
  ];

  const certifications = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "Meta React Professional Certificate",
    "MongoDB Certified Developer",
  ];

  return (
    <section id="about" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">About</span>{" "}
            <span className="text-primary">Me</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Passionate developer dedicated to creating exceptional digital experiences
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1566915896913-549d796d2166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBjb2RpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcyMTcwOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Developer workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Full Stack Developer</h2>
            <div className="space-y-4 text-gray-400">
              <p>
                I'm a passionate full-stack developer with a love for creating beautiful, 
                functional, and user-friendly applications. My journey in software development 
                began with a curiosity for how things work and evolved into a career focused 
                on building solutions that make a difference.
              </p>
              <p>
                With expertise spanning both frontend and backend technologies, I enjoy 
                tackling complex challenges and transforming ideas into reality. I believe 
                in writing clean, maintainable code and staying current with the latest 
                industry trends and best practices.
              </p>
              <p>
                When I'm not coding, you can find me contributing to open-source projects, 
                writing technical blog posts, or exploring new technologies that push the 
                boundaries of what's possible on the web.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">Education</h2>
          </div>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                  <span className="text-primary text-sm">{edu.year}</span>
                </div>
                <p className="text-gray-300 mb-2">{edu.institution}</p>
                <p className="text-gray-400">{edu.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">Certifications</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="p-4 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 flex items-center gap-3"
              >
                <Award className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-300">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">My Philosophy</h2>
          </div>
          <div className="space-y-4 text-gray-400">
            <p className="text-lg">
              "Code is poetry, and every line tells a story. I strive to write code that is 
              not just functional, but elegant, maintainable, and a joy to work with."
            </p>
            <p>
              I believe in continuous learning, collaboration, and the power of technology 
              to solve real-world problems. My approach combines technical excellence with 
              a deep understanding of user needs and business goals.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}