import { motion } from "motion/react";
import { Calendar, MapPin, Briefcase } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      title: "Software Developer Intern",
      company: "Software Persona",
      location: "İstanbul, Turkey",
      period: "Jan 2026 - Present",
      type: "Internship",
      description: "Completed a multidisciplinary software internship at SoftwarePersona, focusing on UI/UX design, web development, database systems, and mobile application development. Actively participated in project design and production processes within a collaborative development environment.",
      achievements: [
        "Contributed to end-to-end project workflows from design to deployment",

        "Designed and implemented database structures using SQL principles",

        "Developed responsive web interfaces aligned with UI/UX best practices",

        "Participated in mobile application development processes",

        "Collaborated within a structured team-based development environment",  
      ],
      technologies: ["React", "Node.js", "AWS", "MongoDB", "TypeScript", "Docker"],
    },
  ];

  return (
    <section id="experience" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">Work</span>{" "}
            <span className="text-primary">Experience</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            My professional journey and key achievements in software development
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-red-700 to-transparent md:-translate-x-1/2" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-black md:-translate-x-1/2 z-10" />

                {/* Content */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="p-6 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-lg text-primary mb-2">{exp.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-4">{exp.description}</p>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-primary mt-1">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-secondary border border-primary/20 text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}{/*
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid sm:grid-cols-3 gap-6"
        >
          {[
            { label: "Years Experience", value: "5+" },
            { label: "Projects Completed", value: "50+" },
            { label: "Happy Clients", value: "30+" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>*/}
      </div>
    </section>
  );
}