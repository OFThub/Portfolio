/**
 * Project copy, keyed by the slug used in `RAW_PROJECTS` (Projects.tsx).
 *
 * Only the words live here — image paths, repository URLs, technology lists and
 * the `featured` flag stay in the component, because duplicating them per
 * language is how they drift apart.
 */
export const enProjects = {
  sportify: {
    title: "Sportify",
    category: "All",
    description: "Fitness centre management and appointment system.",
  },
  aiContentPlatform: {
    title: "AI Content Platform",
    category: "All",
    description: "All-in-one platform for AI-driven content creation and management.",
  },
  taskManagement: {
    title: "Real-Time Task Management System",
    category: "Full-Stack",
    description:
      "A collaborative project management platform featuring real-time synchronisation, role-based access control, and interactive Kanban boards.",
  },
  eventFlowCommerce: {
    title: "EventFlowCommerce",
    category: "Microservices",
    description:
      "A production-ready reference implementation of event-driven microservices architecture using DDD, Event Sourcing, CQRS, and the Saga pattern.",
  },
  documentSimplifier: {
    title: "AI Document Simplifier",
    category: "Artificial Intelligence",
    description:
      "A fully functional multi-agent system built to solve real-world legal document analysis problems: it simplifies complex texts and performs risk analysis.",
  },
  onlineLibrary: {
    title: "Online Library Application",
    category: "Full Stack Development",
    description:
      "A comprehensive digital library platform with user, author, and admin roles, featuring book uploading, approval mechanisms, category filtering, and interaction systems such as comments, likes, and ratings.",
  },
  dropSystem: {
    title: "Limited-Stock Product Drop System",
    category: "Full Stack Development / Backend Engineering",
    description:
      "A reservation system designed for high-traffic product launches, preventing race conditions with PostgreSQL SELECT FOR UPDATE locking. It guarantees stock accuracy, automatic reservation expiry, and detailed inventory audit trails.",
  },
  tarsau: {
    title: "tarsau — File Archiving Tool",
    category: "System Programming / File Management",
    description:
      "A file archiving program in the spirit of tar, rar and zip, but with no compression. It concatenates text files into a single .sau archive and extracts them again, and is built with make. Archiving runs as “tarsau -b file1 file2 … -o archive.sau”, extraction as “tarsau -a archive.sau [target_directory]”. The archive opens with an organisation section holding the total size plus pipe-separated file names, permissions and sizes, followed by each file’s contents in order. One archive holds up to 32 files and 200 MB in total, and only ASCII text files are supported.",
  },
  alganChatbot: {
    title: "Algan AI Chatbot",
    category: "All",
    description:
      "Modular AI chatbot system with dynamic mode switching, operated by voice commands.",
  },
  sudoku: {
    title: "Sudoku Game",
    category: "All",
    description:
      "Cross-platform Sudoku game running both in the browser and as a standalone desktop application, with real-time cell validation and instant completion feedback.",
  },
  smashMateMinesweeper: {
    title: "SmashMate — Minesweeper Edition",
    category: "Mobile",
    description:
      "A fully featured Minesweeper game built with React Native and Expo (SDK 52), using Expo Router for navigation. Features first-click safety, BFS chain reveal, light and dark themes, haptic feedback, and smooth Reanimated animations.",
  },
  portfolio: {
    title: "Full Stack Developer Portfolio",
    category: "Web",
    description:
      "A single-page portfolio built with React, TypeScript and Tailwind CSS on a black-and-red palette with smooth scroll navigation. Canvas and WebGL backgrounds, Motion animations, a fully responsive layout, live GitHub statistics, and English/Turkish language support.",
  },
  smashMateFileManager: {
    title: "SmashMate File Manager — REST Service",
    category: "Backend",
    description:
      "A RESTful file management service built with Java 21 and Spring Boot 3.4.4 that stores files in Cloudflare R2 object storage, keeps metadata in H2, and serves image thumbnail previews. Supports single and batch multipart upload, downloads with correct content-type and content-disposition headers, auto-generated 200×200 JPEG thumbnails via Thumbnailator with R2 caching, and structured JSON metadata previews for non-image files. Includes paginated listing, file validation, global error handling, and Swagger/OpenAPI documentation.",
  },
  miniKatalog: {
    title: "Mini Catalogue — Flutter Application",
    category: "Mobile",
    description:
      "An educational mini e-commerce catalogue app built with Flutter, made up of splash screen, product grid with search, detail and add-to-cart, and cart management screens. It offers real-time product search, chip-based category filtering, and cart management with quantity updates. Integrates the FakeStore API with an offline fallback for when there is no connection. A layered architecture separates data services, models (product, cart_item, cart), screens, and modular widgets (product_card, category_filter, search_bar_widget). Written as practice in widget trees, state management with setState and ChangeNotifier, async network requests, fromJson and toJson model conversion, dynamic GridView and ListView rendering, and ThemeData with AnimationController and Tween.",
  },
  planetSimulation: {
    title: "Interplanetary Life and Travel Simulation",
    category: "Desktop / System",
    description:
      "A modular interplanetary travel console simulation written in C with MinGW, designed around object-oriented principles simulated through structs and function pointers to emulate inheritance and polymorphism. A hierarchy of Time, Person, Spacecraft, Simulation and FileReader structures sits alongside a Planet base with RockyPlanet, GasGiant, IceGiant and DwarfPlanet derivatives. A time loop follows real calendar rules and advances one simulated hour per iteration. Remaining lifespans fall according to ageing factors that vary by planet type: rocky and in transit 1.0, gas giant 0.1, ice giant 0.5, dwarf planet 0.01. A craft departs when its planet’s date reaches its departure date; people whose lifespan reaches zero die, and once every passenger has died the craft is marked destroyed. Population is tracked in real time, excluding passengers in transit. Built for performance over large data files with no thread sleeps and a continuously cleared console, using separate header and source files compiled through a Makefile hierarchy.",
  },
  mnist: {
    title: "Handwritten Digit Recognition (MNIST)",
    category: "Artificial Intelligence",
    description:
      "The first step of an AI learning journey covering the fundamentals and the core libraries, with an introductory handwritten digit recognition program later ported to an HTML interface.",
  },
  trafficAnalysis: {
    title: "Traffic Flow Analysis and Vehicle Counter",
    category: "Artificial Intelligence",
    description:
      "The second project of the learning journey: a computer-vision application that analyses traffic flow by detecting and counting vehicles according to the lane they use.",
  },
  matrixPointer: {
    title: "Pointer Arithmetic and Custom Summation on a Dynamic 2D Matrix",
    category: "System Programming",
    description:
      "A C program that operates on a dynamically allocated two-dimensional matrix using pointer arithmetic alone, summing the main and secondary diagonals without counting the centre element twice.",
  },
  oftify: {
    title: "OFTify",
    category: "Mobile Application",
    description:
      "A full-featured local music player in the spirit of Spotify. It scans the device’s music files automatically and groups them into playlists, categories, artists and albums. Includes background playback, Fisher-Yates shuffle, and a modern dark theme with a custom spinning vinyl animation.",
  },
};
