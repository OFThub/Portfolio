import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Github, Filter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Projects() {
  const [filter, setFilter] = useState("All");

  const projects = [
    {
      title: "E-Commerce Platform",
      category: "All",
      description: "A complete e-commerce solution with shopping cart, payment integration, and admin dashboard. Built with modern technologies for optimal performance.",
      image: "https://images.unsplash.com/photo-1694599048261-a1de00f0117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWdufGVufDF8fHx8MTc3MjE0NjE5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      github: "https://github.com",
      live: "https://example.com",
      featured: true,
    },
  ];

  const categories = ["All"];

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">Featured</span>{" "}
            <span className="text-primary">Projects</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A selection of my recent work showcasing various technologies and solutions
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-12 flex-wrap"
        >
          <Filter className="w-5 h-5 text-primary" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                filter === category
                  ? "bg-primary text-white"
                  : "bg-card border border-primary/20 text-gray-400 hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              {project.featured && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-primary text-white text-xs rounded-full">
                  Featured
                </div>
              )}

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Hover Links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/80 hover:bg-primary rounded-full transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-black/80 hover:bg-primary rounded-full transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-secondary border border-primary/10 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Want to see more?</h2>
          <p className="text-gray-400 mb-6">
            Check out my GitHub profile for more projects and contributions
          </p>
          <a
            href="https://github.com/OFThub/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-lg transition-all duration-300"
          >
            <Github className="w-5 h-5" />
            View GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
}