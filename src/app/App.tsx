import { useState } from "react";
import { MotionConfig } from "motion/react";

import { LanguageProvider, useI18n } from "../i18n";
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import Loading from './components/Loading';
import EmberBackground from './components/Background';
import { SpotlightEffect } from "./components/effects/Spotlight";

/**
 * The page itself. Split out from `App` so it can call `useI18n` — a hook
 * cannot read a provider that its own component renders.
 */
function Portfolio() {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <SpotlightEffect />
      {!loaded && <Loading onComplete={() => setLoaded(true)} />}

      {loaded && (
        <>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded focus:outline-none"
          >
            {t.nav.skipToContent}
          </a>
          <EmberBackground />
          <div className="min-h-screen relative z-10 bg-transparent">
            <Navigation />
            <main id="main-content">
              <Home />
              <About />
              <Skills />
              <Experience />
              <Projects />
              <Blog />
              <Contact />
            </main>
            <Footer />
          </div>
        </>
      )}
    </MotionConfig>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  );
}
