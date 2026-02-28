import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Blog() {
  const blogPosts = [
    {
      id: "",
      title: "",
      excerpt: "",
      image: "",
      date: "",
      readTime: "",
      tags: ["React", "JavaScript", "Web Development"],
      featured: true,
    },
    {/*
    {
      id: "1",
      title: "Building Scalable React Applications: Best Practices for 2026",
      excerpt: "Learn the essential patterns and practices for building large-scale React applications that are maintainable, performant, and easy to scale.",
      image: "https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXZhc2NyaXB0JTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcyMTkyNzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      date: "Feb 20, 2026",
      readTime: "8 min read",
      tags: ["React", "Best Practices", "Architecture"],
      featured: true,
    }*/}
  ];
  
  if (blogPosts.length === 2) {
    return (
      <section id="blog" className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Blog Coming Soon
          </h1>
          <p className="text-gray-400">
            I’ll be sharing insights and technical articles here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">Tech</span>{" "}
            <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on web development and technology
          </p>
        </motion.div>

        {/* Featured Posts */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-white mb-8"
          >
            Featured Articles
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts
              .filter((post) => post.featured)
              .map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="group block bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs rounded-full">
                      Featured
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-secondary border border-primary/10 text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-8"
          >
            Recent Articles
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts
              .filter((post) => !post.featured)
              .map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group block bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-secondary border border-primary/10 text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>
        </div>

       {/* Newsletter CTA */}{/*
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg text-center"
        >
          <Tag className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to my newsletter to receive the latest articles, tutorials, and tech insights
            directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-secondary border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-lg transition-all duration-300">
              Subscribe
            </button>
          </div>
        </motion.div>*/}
      </div>
    </section>
  );
}
