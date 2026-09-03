import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useI18n } from "../../i18n";

/* Section order drives both the navbar and the scroll-spy. Module scope keeps
   the identity stable so the scroll listener effect has an honest dep list —
   and it means switching language never re-registers the scroll listener. */
const SECTION_IDS = ["home", "about", "skills", "experience", "projects", "blog", "contact"] as const;

/* ─── Language switch ────────────────────────────────────────────────────
   Two explicit segments rather than a single toggle: the visitor can see
   which language is active and which one they are switching to. */
function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.language.switchAria}
      className={`flex items-center gap-1 font-mono text-xs border border-primary/25 rounded-md px-1 py-1 ${className}`}
    >
      {(["en", "tr"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className="relative px-2 py-0.5 rounded transition-colors duration-200"
            style={{
              background: active ? "rgba(239,68,68,0.18)" : "transparent",
              color: active ? "rgb(239,68,68)" : "rgb(156,163,175)",
            }}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Corner Decoration ──────────────────────────────────────────────── */
function CornerDeco({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[position];
  return <div className={`absolute w-3 h-3 border-primary/50 ${cls}`} />;
}

/* ─── Glitch Text ────────────────────────────────────────────────────── */
function GlitchLogo({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const run = () => { setGlitching(true); setTimeout(() => setGlitching(false), 160); };
    const id = setInterval(run, 5000 + Math.random() * 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block">
      {children}
      {glitching && (
        <>
          <span className="absolute inset-0 text-red-400 opacity-70" style={{ clipPath: "inset(0 0 55% 0)", transform: "translateX(-2px)" }}>{children}</span>
          <span className="absolute inset-0 text-cyan-400 opacity-70" style={{ clipPath: "inset(55% 0 0 0)", transform: "translateX(2px)" }}>{children}</span>
        </>
      )}
    </span>
  );
}

/* ─── Magnetic Nav Button ────────────────────────────────────────────── */
function MagneticNavBtn({
  children,
  onClick,
  isActive,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="spotlight glass-hover relative px-4 py-2 text-sm group"
    >
      {children}
      {/* Active underline with layoutId */}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {/* Hover glow dot */}
      {!isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary/60"
          style={{ transition: "background 0.2s" }}
        />
      )}
    </motion.button>
  );
}

/* ─── Scan Line (slim, for nav border) ──────────────────────────────── */
function NavScanLine() {
  return (
    <motion.div
      className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
      style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)" }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN NAVIGATION COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const { t } = useI18n();
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const links = SECTION_IDS.map((id) => ({ id, label: t.nav[id] }));


  /* ── Active section tracker ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPosition = window.scrollY + 100;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        aria-label={t.nav.mainNavAria}
        className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 overflow-hidden"
        style={{
          // backdrop-filter kaldırıldı: altındaki canvas her karede değiştiği için
          // entegre GPU'larda sürekli re-blur ~15fps'e mal oluyordu
          background: scrolled
            ? "rgba(0,0,0,0.95)"
            : "rgba(0,0,0,0.85)",
          transition: "background 0.3s",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-red-400 to-primary z-20 pointer-events-none"
          style={{ width: progressWidth }}
        />

        {/* Animated border scan */}
        <NavScanLine />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <motion.button
              onClick={() => scrollToSection("home")}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              className="spotlight relative flex items-center space-x-2.5 cursor-pointer group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Logo box */}
              <div className="relative">
                <motion.div
                  className="w-10 h-9 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center overflow-hidden"
                  animate={{ rotate: logoHovered ? [0, -4, 4, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Shimmer inside logo */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full"
                    animate={logoHovered ? { x: ["-100%", "200%"] } : {}}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="text-white font-bold text-base relative z-10">OFT</span>
                </motion.div>
                {/* Small corner decos on logo */}
                <AnimatePresence>
                  {logoHovered && (
                    <>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t border-l border-primary/80" />
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b border-r border-primary/80" />
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Name */}
              <span className="text-white text-base font-bold hidden sm:block">
                <GlitchLogo>Ömer Faruk TÜRKDOĞDU</GlitchLogo>
              </span>
              <span className="text-white text-base font-bold sm:hidden">
                <GlitchLogo>OFT</GlitchLogo>
              </span>
            </motion.button>

            {/* ── Desktop Nav Links ── */}
            <motion.div
              className="hidden md:flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {links.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MagneticNavBtn
                    onClick={() => scrollToSection(link.id)}
                    isActive={activeSection === link.id}
                  >
                    <motion.span
                      animate={{
                        color: activeSection === link.id ? "rgb(239,68,68)" : "rgb(209,213,219)",
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 font-mono text-xs tracking-wide"
                    >
                      {/* Index number */}
                      <motion.span
                        className="text-primary/40 mr-1"
                        animate={{ opacity: activeSection === link.id ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {String(i + 1).padStart(2, "0")}.
                      </motion.span>
                      {link.label}
                    </motion.span>
                  </MagneticNavBtn>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Language (desktop) ── */}
            <motion.div
              className="hidden md:flex"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <LanguageSwitch />
            </motion.div>

            {/* ── Mobile Hamburger ── */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="spotlight md:hidden relative p-2 text-white overflow-hidden"
              aria-label={t.nav.menuToggleAria}
              aria-expanded={isOpen}
              whileTap={{ scale: 0.92 }}
            >
              {/* Corner decos on hamburger */}
              <CornerDeco position="tl" />
              <CornerDeco position="br" />
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} className="text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden bg-black/96 backdrop-blur-lg border-t border-primary/20 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {links.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => scrollToSection(link.id)}
                    className="spotlight relative block w-full text-left px-4 py-3 rounded-lg overflow-hidden group"
                    style={{
                      background: activeSection === link.id ? "rgba(239,68,68,0.15)" : "transparent",
                      borderColor: activeSection === link.id ? "rgba(239,68,68,0.4)" : "transparent",
                      border: "1px solid",
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== link.id) {
                        e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== link.id) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    {/* Corner decos for active mobile item */}
                    {activeSection === link.id && (
                      <>
                        <CornerDeco position="tl" />
                        <CornerDeco position="br" />
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      {/* Index */}
                      <span className="text-primary/40 text-xs font-mono w-6 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{ color: activeSection === link.id ? "rgb(239,68,68)" : "rgb(209,213,219)" }}
                      >
                        {link.label}
                      </span>
                      {/* Active indicator dot */}
                      {activeSection === link.id && (
                        <motion.div
                          className="ml-auto relative"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <motion.div
                            className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-primary"
                            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}

                {/* ── Language (mobile) ── */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: SECTION_IDS.length * 0.05, duration: 0.3 }}
                  className="pt-3 mt-2 border-t border-primary/15 flex justify-center"
                >
                  <LanguageSwitch />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}