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
  arnavutkoyLogistics: {
    title: "Arnavutköy Logistics Hub",
    category: "Data Visualisation",
    description:
      "A dashboard that asks one measurable question about the corridor around Istanbul Airport: which neighbourhoods carry the most people per bus stop, and how far are they from the jobs. Computed from 649 real OpenStreetMap bus stops and İBB population figures, it finds that 7 of 38 neighbourhoods are underserved while holding 48% of the district population — a 49-fold gap between best and worst. A simulated 24-hour flow layer sits alongside the measured data and is labelled as a simulation everywhere it appears, so model and measurement are never confused. Runs with no API keys at all.",
  },
  arnavutkoyGis: {
    title: "Arnavutköy GIS",
    category: "Full Stack Development",
    description:
      "A browser-based geographic information system built for Arnavutköy Municipality, joining zoning, cadastre, infrastructure, earthquake-scenario, city-service and topography data onto a single map across 35 layers. Role-based access serves both residents and municipal staff: visitors see public layers, staff see ownership and zoning. A second page scores all 38 neighbourhoods 0–100 on the indicators someone actually checks before moving — earthquake scenario, distance to daily needs, local services, expected infrastructure damage — with ranking and side-by-side comparison, no login required. It degrades to a public-only mode when the backend is unavailable rather than failing.",
  },
  akbilSis: {
    title: "Arnavutköy Akbil — Transit Simulation",
    category: "Full-Stack",
    description:
      "A three-part system that simulates the whole life of a transit card: a mobile app taps the card, a server applies the fare rules, and the municipality analyses line density. It covers the journey end to end — tap-in, fare calculation, balance, bus simulation, and an admin view with density colour coding.",
  },
  seyrek: {
    title: "SEYREK — Voice Desktop Assistant",
    category: "Artificial Intelligence",
    description:
      "A voice-driven, multilingual desktop assistant. Say the wake word to an on-screen energy orb and it listens in any language, acts through a Claude-based brain, and answers out loud. Two processes talk over a loopback-only, token-authenticated WebSocket: a Python backend (voice activity detection, wake word, faster-whisper speech-to-text, an event bus, a state-machine orchestrator, a skill catalogue behind a permission guard, edge-tts speech) and an Electron HUD rendering the WebGL orb, captions and approval cards. It also observes its own usage to propose improvements and, with approval, writes them into its own code.",
  },
  adgs: {
    title: "ADGS — Traffic Video Analysis",
    category: "Artificial Intelligence",
    description:
      "A decision-support tool that analyses traffic footage to detect road and infrastructure damage, accidents and traffic violations, built during a municipal internship. Its scope is drawn by law rather than by preference: a municipality cannot issue traffic fines, so the system produces maintenance work orders, black-spot planning data and evidence packages — never a penalty. The fault module deliberately outputs no percentages, following the logic of an official accident report instead. Number-plate and face blurring are on by default, and raw footage never enters the repository.",
  },
  oftAgents: {
    title: "OFTagents — Claude Code Plugin Marketplace",
    category: "Developer Tooling",
    description:
      "A plugin marketplace for Claude Code, built on one idea: a convention asks, a gate insists. Its plugins make it deterministically impossible to write code into an undocumented project. Three ship today — precode (the documentation gate), oncode (the token bill) and postcode (documentation quality) — backed by the skills that feed them, 237 passing tests and zero runtime dependencies. New plugins can be added without writing any code.",
  },
  stockPredictions: {
    title: "Investment Tracking and Forecasting",
    category: "Data Science",
    description:
      "A Streamlit application that compares roughly 60 assets on one screen in Turkish lira — crypto, currencies, precious metals, oil, BIST and US equities, world indices, housing price indices and Steam CS2 items. Each asset gets its historical chart, a Prophet forecast with an 80% confidence band, and 1/3/6/12-month targets. Every forecast carries an accuracy score: the last 90 days are hidden from the model, predicted, then compared against what actually happened (score = 100 − MAPE). Data comes from yfinance, TCMB EVDS and the Steam market, cached to Parquet so it still works offline.",
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
  sudoku: {
    title: "Sudoku Game",
    category: "All",
    description:
      "Cross-platform Sudoku game running both in the browser and as a standalone desktop application, with real-time cell validation and instant completion feedback.",
  },
  planetSimulation: {
    title: "Interplanetary Life and Travel Simulation",
    category: "Desktop / System",
    description:
      "A modular interplanetary travel console simulation written in C with MinGW, designed around object-oriented principles simulated through structs and function pointers to emulate inheritance and polymorphism. A hierarchy of Time, Person, Spacecraft, Simulation and FileReader structures sits alongside a Planet base with RockyPlanet, GasGiant, IceGiant and DwarfPlanet derivatives. A time loop follows real calendar rules and advances one simulated hour per iteration. Remaining lifespans fall according to ageing factors that vary by planet type: rocky and in transit 1.0, gas giant 0.1, ice giant 0.5, dwarf planet 0.01. A craft departs when its planet’s date reaches its departure date; people whose lifespan reaches zero die, and once every passenger has died the craft is marked destroyed. Population is tracked in real time, excluding passengers in transit. Built for performance over large data files with no thread sleeps and a continuously cleared console, using separate header and source files compiled through a Makefile hierarchy.",
  },
  oftify: {
    title: "OFTify",
    category: "Mobile Application",
    description:
      "A full-featured local music player in the spirit of Spotify. It scans the device’s music files automatically and groups them into playlists, categories, artists and albums. Includes background playback, Fisher-Yates shuffle, and a modern dark theme with a custom spinning vinyl animation.",
  },
};
