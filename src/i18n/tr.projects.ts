import type { enProjects } from "./en.projects";

/**
 * Turkish project copy. Typed against the English original, so a project added
 * there without a translation here is a build error.
 *
 * `miniKatalog`, `planetSimulation`, `matrixPointer` and `oftify` keep their
 * original Turkish wording — the English entries are the translations, not the
 * other way round.
 */
export const trProjects: typeof enProjects = {
  sportify: {
    title: "Sportify",
    category: "Tümü",
    description: "Spor salonu yönetim ve randevu sistemi.",
  },
  aiContentPlatform: {
    title: "AI Content Platform",
    category: "Tümü",
    description: "Yapay zekâ destekli içerik üretimi ve yönetimi için hepsi bir arada platform.",
  },
  taskManagement: {
    title: "Gerçek Zamanlı Görev Yönetim Sistemi",
    category: "Full-Stack",
    description:
      "Gerçek zamanlı senkronizasyon, rol tabanlı erişim denetimi ve etkileşimli Kanban panoları sunan işbirlikçi proje yönetim platformu.",
  },
  eventFlowCommerce: {
    title: "EventFlowCommerce",
    category: "Mikroservisler",
    description:
      "DDD, Event Sourcing, CQRS ve Saga desenini kullanan, üretime hazır bir olay güdümlü mikroservis mimarisi referans uygulaması.",
  },
  documentSimplifier: {
    title: "Yapay Zekâ Destekli Belge Sadeleştirici",
    category: "Yapay Zekâ",
    description:
      "Gerçek dünyadaki hukuki belge analizi problemlerini çözmek için tasarlanmış, çok ajanlı mimariye sahip tam işlevsel bir sistem: karmaşık metinleri sadeleştirir ve risk analizi yapar.",
  },
  onlineLibrary: {
    title: "Çevrim İçi Kütüphane Uygulaması",
    category: "Full Stack Geliştirme",
    description:
      "Kullanıcı, yazar ve yönetici rolleri bulunan kapsamlı bir dijital kütüphane platformu; kitap yükleme, onay mekanizmaları, kategori filtreleme ve yorum, beğeni, puanlama gibi etkileşim sistemleri içerir.",
  },
  dropSystem: {
    title: "Sınırlı Stoklu Ürün Drop Sistemi",
    category: "Full Stack Geliştirme / Backend Mühendisliği",
    description:
      "Yoğun trafikli ürün lansmanları için tasarlanmış rezervasyon sistemi; PostgreSQL SELECT FOR UPDATE kilitlemesiyle race condition oluşumunu engeller. Stok doğruluğunu, otomatik rezervasyon süresi yönetimini ve ayrıntılı envanter denetim kayıtlarını garanti eder.",
  },
  tarsau: {
    title: "tarsau — Dosya Arşivleme Aracı",
    category: "Sistem Programlama / Dosya Yönetimi",
    description:
      "tar, rar ve zip gibi çalışan ancak sıkıştırma yapmayan bir dosya arşivleme programı. Metin dosyalarını tek bir .sau arşiv dosyasında birleştirir ve geri çıkarır; make komutuyla derlenir. Arşivleme “tarsau -b dosya1 dosya2 … -o arsiv.sau”, çıkarma ise “tarsau -a arsiv.sau [hedef_dizin]” biçiminde çalışır. Arşiv dosyası; toplam boyut ile dikey çizgiyle ayrılmış dosya adları, izinler ve boyutları içeren bir organizasyon bölümüyle başlar, ardından dosyaların içerikleri sırayla gelir. Tek bir arşiv en fazla 32 dosya ve toplam 200 MB içerebilir; yalnızca ASCII metin dosyaları desteklenir.",
  },
  alganChatbot: {
    title: "Algan Yapay Zekâ Sohbet Botu",
    category: "Tümü",
    description:
      "Sesli komutlarla çalışan, dinamik mod değiştirmeli modüler yapay zekâ sohbet botu sistemi.",
  },
  sudoku: {
    title: "Sudoku Oyunu",
    category: "Tümü",
    description:
      "Hem tarayıcıda hem de bağımsız masaüstü uygulaması olarak sorunsuz çalışan, gerçek zamanlı hücre doğrulaması ve anında tamamlama geri bildirimi sunan çok platformlu Sudoku oyunu.",
  },
  smashMateMinesweeper: {
    title: "SmashMate — Mayın Tarlası Sürümü",
    category: "Mobil",
    description:
      "React Native ve Expo (SDK 52) ile geliştirilmiş, gezinme için Expo Router kullanan tam donanımlı bir Mayın Tarlası oyunu. İlk tıklama güvenliği, BFS zincirleme açma, açık ve koyu tema, dokunsal geri bildirim ve akıcı Reanimated animasyonları içerir.",
  },
  portfolio: {
    title: "Full Stack Developer Portfolyo",
    category: "Web",
    description:
      "React, TypeScript ve Tailwind CSS ile geliştirilmiş, siyah-kırmızı paleti ve akıcı kaydırma gezinmesi olan tek sayfalık portfolyo. Canvas ve WebGL arka planları, Motion animasyonları, tamamen duyarlı yerleşim, canlı GitHub istatistikleri ve İngilizce/Türkçe dil desteği içerir.",
  },
  smashMateFileManager: {
    title: "SmashMate Dosya Yöneticisi — REST Servisi",
    category: "Backend",
    description:
      "Java 21 ve Spring Boot 3.4.4 ile geliştirilmiş, dosyaları Cloudflare R2 nesne depolamada tutan, meta verileri H2 üzerinde yöneten ve görsel küçük resim önizlemesi sunan RESTful dosya yönetim servisi. Multipart form ile tekli ve toplu dosya yükleme, doğru content-type ve content-disposition başlıklarıyla indirme, Thumbnailator ile otomatik üretilen 200×200 JPEG önizlemeler (R2 önbellekli) ve görsel olmayan dosyalar için yapılandırılmış JSON meta veri önizlemesi sağlar. Sayfalı listeleme, dosya doğrulama, merkezî hata yönetimi ve Swagger/OpenAPI dokümantasyonu içerir.",
  },
  miniKatalog: {
    title: "Mini Katalog — Flutter Uygulaması",
    category: "Mobil",
    description:
      "Flutter ile geliştirilmiş, eğitim amaçlı mini e-ticaret katalog uygulaması. Splash Screen, Ürün Grid + Arama, Detay + Sepete Ekle ve Sepet Yönetimi ekranlarından oluşur. Gerçek zamanlı ürün arama, Chip'lerle kategori filtresi, ürün ekleme/çıkarma ve miktar güncelleme özellikli sepet yönetimi sunar. FakeStore API entegrasyonu ve internet bağlantısı olmadığında çalışan offline fallback yapısı içerir. Renkli ve modern UI için özel tema, açılış ve geçiş animasyonları ile Navigator.push ve Route Arguments kullanan sayfa geçişleri barındırır. Proje; veri servisleri, modeller (product, cart_item, cart), ekranlar ve modüler widget'lar (product_card, category_filter, search_bar_widget) şeklinde katmanlı mimariye sahiptir. Eğitim kapsamında Widget ağacı (Stateless/Stateful), setState ve ChangeNotifier ile State yönetimi, http paketiyle async/await ağ istekleri, model sınıflarında fromJson/toJson dönüşümleri, dinamik GridView/ListView listeleme, ThemeData ve AnimationController/Tween kullanımı pratik edilmiştir.",
  },
  planetSimulation: {
    title: "Gezegenler Arası Yaşam ve Seyahat Simülasyonu",
    category: "Masaüstü / Sistem",
    description:
      "MinGW C Dili kullanılarak Nesne Yönelimli Programlama (NDP) benzetimi prensiplerine göre tasarlanmış, modüler ve kapsamlı bir gezegenler arası seyahat konsol simülasyonu. Proje; structlar ve fonksiyon işaretçileri kullanılarak kalıtım ile polimorfizm kavramlarının C dilinde simüle edilmesi esasına dayanır. Zaman, Kişi, UzayAracı, Simülasyon, DosyaOkuma yapıları ile Gezegen (Üst Yapı) altındaki KayacGezegen, GazDevi, BuzDevi ve CuceGezegen türetilmiş yapılarını içeren bir hiyerarşiye sahiptir. Gerçek takvim kurallarına göre işleyen bir zaman döngüsü barındırır ve her döngü iterasyonunda 1 simülasyon saati ilerlenir. Kişilerin kalan ömürleri; bulundukları gezegenin türüne göre dinamik olarak değişen yaşlanma faktörlerine (Kayaç ve Yolda: 1.0, Gaz Devi: 0.1, Buz Devi: 0.5, Cüce Gezegen: 0.01) bağlı olarak düşer. Uzay araçları, bulundukları gezegenin tarihi kendi çıkış tarihlerine eşitlendiğinde seyahate başlar; kalan ömrü sıfırlanan kişiler ölür ve araçtaki tüm yolcular öldüğünde araç İMHA durumuna geçer. Nüfus takibi gerçek zamanlı yapılarak yoldaki araçların yolcuları gezegen nüfuslarına dahil edilmez. Büyük veri dosyalarından okuma yapabilen performans odaklı mimaride thread sleep kullanılmamış, konsol sürekli temizlenerek akıcı bir simülasyon sağlanmıştır. Başlık (.h) ve kaynak (.c) dosyalarının ayrı tasarlandığı modüler yapı, Makefile hiyerarşisine uygun şekilde derlenmektedir.",
  },
  mnist: {
    title: "El Yazısı Rakam Tanıma (MNIST)",
    category: "Yapay Zekâ",
    description:
      "Yapay zekânın temellerine ve çekirdek kütüphanelere odaklanan öğrenme yolculuğunun ilk adımı; el yazısı rakam tanıma yapan giriş seviyesi bir program, sonrasında HTML arayüzüne taşındı.",
  },
  trafficAnalysis: {
    title: "Trafik Akışı Analizi ve Araç Sayacı",
    category: "Yapay Zekâ",
    description:
      "Öğrenme yolculuğunun ikinci projesi: araçları kullandıkları şeride göre tespit edip sayarak trafik akışını analiz eden bilgisayarlı görü uygulaması.",
  },
  matrixPointer: {
    title: "Dinamik 2B Matris Üzerinde İşaretçi Aritmetiği ve Özel Toplam",
    category: "Sistem Programlama",
    description:
      "Yalnızca işaretçi aritmetiği kullanarak dinamik olarak ayrılmış 2 boyutlu bir matris üzerinde işlemler gerçekleştiren, ana ve ikincil köşegen elemanlarının toplamını merkez elemanı mükerrer saymadan hesaplayan bir C programı.",
  },
  oftify: {
    title: "OFTify",
    category: "Mobil Uygulama",
    description:
      "Spotify benzeri, tam teşekküllü yerel müzik çalar uygulaması. Cihaz hafızasındaki müzik dosyalarını otomatik tarayarak çalma listeleri, kategoriler, sanatçı ve albüm bazlı gruplandırma sunar. Arka planda oynatma desteği, Fisher-Yates algoritmalı rastgele karıştırma ve özel vinil disk animasyonlu modern bir koyu tema arayüzüne sahiptir.",
  },
};
