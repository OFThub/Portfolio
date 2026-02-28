import { motion } from "motion/react";
import { ArrowRight, Code2, Database, Globe, Server, ChevronDown } from "lucide-react";
import Spline from '@splinetool/react-spline';

export function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen pt-16">
      {/* Hero Section with Spline 3D Integration Area */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/20" />
        
        {/* Spline 3D Container - Adaptable for your Spline integration */}
        <div className="absolute inset-0 z-0" id="spline-container">
          {/* This is where you'll integrate your Spline 3D scene */}
          <div className="w-full h-full bg-black/50 flex items-center justify-center">
            <div className="text-center text-gray-600 p-8">
              <Globe className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Spline 3D Integration Area</p>
              <p className="text-xs mt-2">Add your Spline embed code here</p>
            </div>
          </div>
        </div>

        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-primary">
                Full Stack
              </span>
              <br />
              <span className="text-primary">Developer</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Crafting elegant solutions with modern technologies.
              <br />
              Specializing in end-to-end web development.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection("projects")}
                className="group px-8 py-4 bg-primary hover:bg-red-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                View My Work
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-8 py-4 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300"
              >
                Get In Touch
              </button>
            </div>
          </motion.div>

          {/* Tech Stack Icons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { icon: Code2, label: "Frontend" },
              { icon: Server, label: "Backend" },
              { icon: Database, label: "Database" },
              { icon: Globe, label: "Cloud" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="group p-6 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-gray-400 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => scrollToSection("about")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center p-2 group-hover:border-primary transition-colors"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.button>
      </div>

      {/* Quick About Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-red-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Turning Ideas Into</span>
              <br />
              <span className="text-primary">Reality</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              With expertise across the full development stack, I create performant, 
              scalable, and user-centric applications that make an impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 bg-card border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => scrollToSection("about")}
              className="inline-flex items-center gap-2 text-primary hover:text-red-400 transition-colors"
            >
              Learn more about me
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
