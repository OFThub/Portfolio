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
import { useState } from "react";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loading onComplete={() => setLoaded(true)} />}

      {loaded && (
        <>
        
          <EmberBackground />
          <div className="min-h-screen relative z-10 bg-transparent">
            <Navigation />
            <Home />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Blog />
            <Contact />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}