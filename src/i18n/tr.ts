import type { en } from "./en";
import { trProjects } from "./tr.projects";
import { trContact } from "./tr.contact";

/**
 * Turkish content.
 *
 * Annotated with `typeof en` on purpose: adding a key to the English dictionary
 * without translating it here fails `npm run typecheck`, which is the only
 * thing standing between a new string and an untranslated page.
 *
 * Kept in the original: personal and company names, technology names, and the
 * source code shown in the About terminal.
 */
export const tr: typeof en = {
  language: {
    switchLabel: "English",
    switchAria: "Dili İngilizceye çevir",
    current: "Türkçe",
  },

  nav: {
    skipToContent: "Ana içeriğe atla",
    mainNavAria: "Ana gezinme",
    menuToggleAria: "Gezinme menüsünü aç/kapat",
    home: "Ana Sayfa",
    about: "Hakkımda",
    skills: "Yetenekler",
    experience: "Deneyim",
    projects: "Projeler",
    blog: "Blog",
    contact: "İletişim",
  },

  loading: {
    subtitle: "Full Stack Developer",
    nameAria: "İsim",
  },

  home: {
    overline: "Portfolyo",
    titleLead: "Full Stack",
    titleAccent: "Geliştirici",
    typewriter: [
      "Modern teknolojilerle zarif çözümler üretiyorum.",
      "Uçtan uca web geliştirme üzerine uzmanlaşıyorum.",
    ],
    ctaWork: "Projelerimi Gör",
    ctaContact: "İletişime Geç",
    scroll: "kaydır",
    tech: [
      { label: "Frontend", desc: "React · TypeScript · Tailwind" },
      { label: "Backend", desc: "Node.js · REST · GraphQL" },
      { label: "Veritabanı", desc: "PostgreSQL · MongoDB · Redis" },
      { label: "Bulut", desc: "AWS · Docker · CI/CD" },
    ],
    approachOverline: "Yaklaşım",
    approachTitleLead: "Fikirleri",
    approachTitleAccent: "Gerçeğe Dönüştürmek",
    pillars: [
      {
        title: "Temiz Kod",
        description:
          "En iyi pratikleri izleyerek sürdürülebilir, ölçeklenebilir ve verimli kod yazmak.",
      },
      {
        title: "Modern Teknoloji",
        description: "En uygun çözümler için güncel teknolojileri ve framework'leri kullanmak.",
      },
      {
        title: "Önce Kullanıcı",
        description:
          "Kullanıcı deneyimini ve erişilebilirliği önceleyen sezgisel arayüzler tasarlamak.",
      },
    ],
    approachSubtitle:
      "Geliştirme yığınının tamamına hâkim olarak; performanslı, ölçeklenebilir ve kullanıcı odaklı, iz bırakan uygulamalar geliştiriyorum.",
    learnMore: "Hakkımda daha fazlası",
  },

  about: {
    overline: "Ben Kimim",
    titleLead: "Hakkımda",
    titleAccent: "Kısaca",
    role: "Full Stack Developer",
    terminalFile: "developer.ts",
    terminalLive: "canlı",
    tagline: "Olağanüstü dijital deneyimler üretmeye adanmış tutkulu bir geliştirici",
    bio: [
      "Güzel, işlevsel ve kullanıcı dostu uygulamalar üretmeyi seven tutkulu bir full-stack geliştiriciyim. Bilgisayar Mühendisliği yolculuğum, işlerin nasıl çalıştığına duyduğum merakla başladı ve fark yaratan çözümler kurmaya odaklanan bir kariyere dönüştü.",
      "Teknolojinin her alanına karşı güçlü bir merakım var; bilgimi genişletmek ve sınırlarımı zorlamak için sürekli çabalıyorum. Farklı alanları keşfetmekten, sistemlerin uçtan uca nasıl işlediğini anlamaktan ve fikirleri yapılandırılmış, uygulanabilir çözümlere dönüştürmekten keyif alıyorum.",
      "Teorik bilgiyi pratiğe dökmeye tutkuluyum; beklentileri sürekli aşarak takımın başarısına katkı sağlıyorum.",
    ],
    educationTitle: "Eğitim",
    certificationsTitle: "Sertifikalar",
    philosophyTitle: "Felsefem",
    quote:
      "Kod yazmak, tıpkı icat gibi, dünyayı dikkatle gözlemlemekle başlar ve bu içgörüyü insan hayatını iyileştiren bir teknolojiye dönüştürür.",
    philosophy: [
      "Bir mühendis olarak beni yönlendiren şey, gerçek dünya problemlerini çözmek ve anlamlı bir etki bırakmak. Tekrarlayan ve yorucu işleri azaltan, böylece insanlara tutkularına daha çok vakit ayırma imkânı veren çözümler kurmaya odaklanıyorum.",
      "Teknolojinin insanların yerini almak yerine onları güçlendirmesi gerektiğine inanıyorum: daha verimli çalışmalarına, daha çok değer üretmelerine ve nihayetinde fırsatlarını kaybetmek yerine daha fazla zaman ve finansal özgürlük kazanmalarına yardımcı olmalı.",
    ],
    education: [
      {
        degree: "Bilgisayar Mühendisliği Lisans",
        institution: "Sakarya Üniversitesi",
        year: "2023 - 2027",
        description:
          "Yazılım geliştirme, algoritmalar ve sistem tasarımı üzerine yoğunlaşan bir eğitim. Hem donanım hem yazılım prensiplerinde sağlam bir temelle, sektördeki gerçek problemlere hazır olarak mezun oluyorum.",
      },
    ],
    certifications: [
      "Software Persona — Yazılım Geliştirme Stajyeri",
      "KOSGEB — Girişimcilik Eğitimi Katılım Sertifikası",
      "Borusan Teknoloji Okulu Sertifikası",
      "Borusan Eşitlik Okulu",
      "Borusan Sürdürülebilirlik Okulu",
    ],
    traits: [
      { label: "Temiz Kod", desc: "Sürdürülebilir ve okunabilir" },
      { label: "Sistem Düşüncesi", desc: "Uçtan uca bakış" },
      { label: "Sürekli Öğrenme", desc: "Merakla besleniyor" },
    ],
  },

  skills: {
    overline: "Teknik",
    titleLead: "Teknik",
    titleAccent: "Yetenekler",
    subtitle: "Teknik uzmanlığıma ve yetkinlik seviyelerime kapsamlı bir bakış",
    softSkillsTitle: "Kişisel Yetkinlikler",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Veritabanı",
      cloud: "Bulut ve DevOps",
      mobile: "Mobil",
      tools: "Araçlar ve Diğerleri",
    },
    soft: {
      problemSolving: "Problem Çözme",
      teamCollaboration: "Takım Çalışması",
      communication: "İletişim",
      projectManagement: "Proje Yönetimi",
    },
    continuousLearningTitle: "Sürekli Öğrenme",
    continuousLearningBody:
      "Teknoloji hızla gelişiyor, ben de öyle. En güncel araçları, framework'leri ve iyi pratikleri takip etmeye kararlıyım. Her proje, yeni bir şey öğrenmek ve işimi daha da inceltmek için bir fırsat.",
  },

  experience: {
    overline: "Kariyer",
    titleLead: "İş",
    titleAccent: "Deneyimi",
    subtitle: "Yazılım geliştirmedeki profesyonel yolculuğum ve önemli kazanımlarım",
    achievementsTitle: "Öne Çıkan Kazanımlar",
    stackTitle: "Teknolojiler",
    items: [
      {
        title: "Yazılım Geliştirme Stajyeri",
        company: "Software Persona",
        location: "İstanbul, Türkiye",
        period: "Oca 2026 - Devam ediyor",
        type: "Staj",
        description:
          "Software Persona bünyesinde UI/UX tasarımı, web geliştirme, veritabanı sistemleri ve mobil uygulama geliştirme alanlarına odaklanan çok disiplinli bir yazılım stajını tamamladım. İşbirlikçi bir geliştirme ortamında proje tasarım ve üretim süreçlerine aktif olarak katıldım.",
        achievements: [
          "Tasarımdan yayına uzanan uçtan uca proje süreçlerine katkı sağladım",
          "SQL prensiplerini kullanarak veritabanı yapıları tasarlayıp uyguladım",
          "UI/UX iyi pratikleriyle uyumlu duyarlı web arayüzleri geliştirdim",
          "Mobil uygulama geliştirme süreçlerinde yer aldım",
          "Yapılandırılmış, takım temelli bir geliştirme ortamında çalıştım",
        ],
      },
    ],
  },

  projects: {
    overline: "Çalışmalar",
    titleLead: "Öne Çıkan",
    titleAccent: "Projeler",
    subtitle: "Farklı teknolojileri ve çözümleri gösteren güncel çalışmalarımdan bir seçki",
    featuredBadge: "Öne Çıkan",
    filterAll: "Tümü",
    githubLinkAria: "GitHub deposunu aç",
    liveLinkAria: "Canlı siteyi aç",
    ctaTitle: "Daha fazlasını görmek ister misiniz?",
    ctaBody: "Daha fazla proje ve katkı için GitHub profilime göz atın",
    ctaButton: "GitHub Profilini Gör",
    items: trProjects,
  },

  contact: trContact,

  blog: {
    overline: "Yazılar",
    titleLead: "Teknoloji",
    titleAccent: "Blogum",
    subtitle: "Web geliştirme ve teknoloji üzerine notlar, rehberler ve düşünceler",
    featuredTitle: "Öne Çıkan Yazılar",
    recentTitle: "Son Yazılar",
    featuredBadge: "Öne Çıkan",
    readMore: "Devamını oku",
    comingSoonStatus: "Durum",
    comingSoonLead: "Blog",
    comingSoonAccent: "Çok Yakında",
    comingSoonBody: "Yakında burada teknik yazılar ve deneyimlerimi paylaşacağım.",
    inProgress: "Hazırlanıyor",
  },

  footer: {
    tagline: "Geliştirici Portfolyosu",
    available: "Yeni projelere açığım",
    quickLinks: "Hızlı Bağlantılar",
    more: "Devamı",
    scroll: "kaydır",
    quote: [
      "Denizde her zaman daha büyük bir balık vardır,",
      "yarın o balık biz olacağız.",
    ],
    rightsSuffix: "Tüm hakları saklıdır.",
  },

  errors: {
    githubUnavailable: "GitHub verileri yüklenemedi",
  },
};
