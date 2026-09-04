import type { enProjects } from "./en.projects";

/**
 * Turkish project copy. Typed against the English original, so a project added
 * there without a translation here is a build error.
 *
 * `planetSimulation` and `oftify` keep their original Turkish wording — the
 * English entries are the translations, not the other way round.
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
  sudoku: {
    title: "Sudoku Oyunu",
    category: "Tümü",
    description:
      "Hem tarayıcıda hem de bağımsız masaüstü uygulaması olarak sorunsuz çalışan, gerçek zamanlı hücre doğrulaması ve anında tamamlama geri bildirimi sunan çok platformlu Sudoku oyunu.",
  },
  planetSimulation: {
    title: "Gezegenler Arası Yaşam ve Seyahat Simülasyonu",
    category: "Masaüstü / Sistem",
    description:
      "MinGW C Dili kullanılarak Nesne Yönelimli Programlama (NDP) benzetimi prensiplerine göre tasarlanmış, modüler ve kapsamlı bir gezegenler arası seyahat konsol simülasyonu. Proje; structlar ve fonksiyon işaretçileri kullanılarak kalıtım ile polimorfizm kavramlarının C dilinde simüle edilmesi esasına dayanır. Zaman, Kişi, UzayAracı, Simülasyon, DosyaOkuma yapıları ile Gezegen (Üst Yapı) altındaki KayacGezegen, GazDevi, BuzDevi ve CuceGezegen türetilmiş yapılarını içeren bir hiyerarşiye sahiptir. Gerçek takvim kurallarına göre işleyen bir zaman döngüsü barındırır ve her döngü iterasyonunda 1 simülasyon saati ilerlenir. Kişilerin kalan ömürleri; bulundukları gezegenin türüne göre dinamik olarak değişen yaşlanma faktörlerine (Kayaç ve Yolda: 1.0, Gaz Devi: 0.1, Buz Devi: 0.5, Cüce Gezegen: 0.01) bağlı olarak düşer. Uzay araçları, bulundukları gezegenin tarihi kendi çıkış tarihlerine eşitlendiğinde seyahate başlar; kalan ömrü sıfırlanan kişiler ölür ve araçtaki tüm yolcular öldüğünde araç İMHA durumuna geçer. Nüfus takibi gerçek zamanlı yapılarak yoldaki araçların yolcuları gezegen nüfuslarına dahil edilmez. Büyük veri dosyalarından okuma yapabilen performans odaklı mimaride thread sleep kullanılmamış, konsol sürekli temizlenerek akıcı bir simülasyon sağlanmıştır. Başlık (.h) ve kaynak (.c) dosyalarının ayrı tasarlandığı modüler yapı, Makefile hiyerarşisine uygun şekilde derlenmektedir.",
  },
  oftify: {
    title: "OFTify",
    category: "Mobil Uygulama",
    description:
      "Spotify benzeri, tam teşekküllü yerel müzik çalar uygulaması. Cihaz hafızasındaki müzik dosyalarını otomatik tarayarak çalma listeleri, kategoriler, sanatçı ve albüm bazlı gruplandırma sunar. Arka planda oynatma desteği, Fisher-Yates algoritmalı rastgele karıştırma ve özel vinil disk animasyonlu modern bir koyu tema arayüzüne sahiptir.",
  },
};
