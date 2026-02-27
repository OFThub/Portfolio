import { motion } from "motion/react";
import { Calendar, MapPin, Briefcase } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      period: "Jan 2023 - Present",
      type: "Full-time",
      description: "Leading the development of enterprise-level web applications using React, Node.js, and AWS. Mentoring junior developers and establishing best practices for the team.",
      achievements: [
        "Architected and deployed microservices architecture serving 500K+ users",
        "Improved application performance by 60% through optimization",
        "Led team of 5 developers in agile environment",
        "Implemented CI/CD pipeline reducing deployment time by 75%",
      ],
      technologies: ["React", "Node.js", "AWS", "MongoDB", "TypeScript", "Docker"],
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      location: "New York, NY",
      period: "Jun 2021 - Dec 2022",
      type: "Full-time",
      description: "Developed and maintained full-stack web applications for various clients across different industries. Collaborated with designers and product managers to deliver high-quality solutions.",
      achievements: [
        "Built 15+ responsive web applications from scratch",
        "Reduced API response time by 40% through database optimization",
        "Implemented real-time features using WebSockets",
        "Contributed to 20+ open-source projects",
      ],
      technologies: ["React", "Express.js", "PostgreSQL", "Next.js", "GraphQL"],
    },
    {
      title: "Frontend Developer",
      company: "Creative Web Studio",
      location: "Remote",
      period: "Jan 2020 - May 2021",
      type: "Contract",
      description: "Focused on creating beautiful, responsive user interfaces and implementing complex frontend features. Worked closely with UX designers to bring designs to life.",
      achievements: [
        "Developed pixel-perfect UI components library used across 10+ projects",
        "Improved website load time by 50% through code splitting",
        "Implemented accessibility features meeting WCAG 2.1 standards",
        "Mentored 3 junior developers in React best practices",
      ],
      technologies: ["React", "Vue.js", "Tailwind CSS", "JavaScript", "Figma"],
    },
    {
      title: "Junior Web Developer",
      company: "StartUp Hub",
      location: "Austin, TX",
      period: "Jun 2019 - Dec 2019",
      type: "Internship",
      description: "Assisted in the development of web applications and learned modern web development practices. Participated in code reviews and team meetings.",
      achievements: [
        "Contributed to 5+ production-ready features",
        "Fixed 50+ bugs and improved code quality",
        "Participated in daily stand-ups and sprint planning",
        "Completed comprehensive training in full-stack development",
      ],
      technologies: ["HTML/CSS", "JavaScript", "Node.js", "MySQL"],
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

        {/* Summary Stats */}
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
        </motion.div>
      </div>
    </section>
  );
}