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
  arnavutkoyLogistics: {
    title: "Arnavutköy Lojistik Merkezi",
    category: "Veri Görselleştirme",
    description:
      "İstanbul Havalimanı koridoruna dair ölçülebilir tek bir soru soran panel: hangi mahalleler durak başına en çok nüfusu taşıyor ve işe ne kadar uzaklar? 649 gerçek OpenStreetMap durağı ve İBB nüfus verisinden hesaplandığında, 38 mahallenin 7'sinin yetersiz hizmet aldığı ve bu 7 mahallenin ilçe nüfusunun %48'ini barındırdığı ortaya çıkıyor — en iyi ile en kötü arasında 49 kat fark var. Ölçülen verinin yanında simüle edilmiş 24 saatlik bir akış katmanı duruyor ve göründüğü her yerde simülasyon olarak etiketleniyor; böylece model ile ölçüm asla karışmıyor. Hiçbir API anahtarı gerektirmeden çalışıyor.",
  },
  arnavutkoyGis: {
    title: "Arnavutköy CBS",
    category: "Full Stack Geliştirme",
    description:
      "Arnavutköy Belediyesi için geliştirilen, tarayıcıda çalışan Coğrafi Bilgi Sistemi. İmar, kadastro, altyapı, deprem senaryosu, kent hizmetleri ve topografya verisini 35 katman hâlinde tek haritada birleştiriyor. Rol tabanlı erişim hem vatandaşa hem personele hizmet veriyor: ziyaretçi kamu katmanlarını, personel mülkiyet ve imar katmanlarını görüyor. İkinci sayfa, 38 mahallenin tamamını taşınmadan önce gerçekten bakılan göstergelerde 0–100 puanlıyor — deprem senaryosu, günlük ihtiyaçlara mesafe, mahalledeki hizmetler, beklenen altyapı hasarı — sıralama ve yan yana karşılaştırmayla, giriş gerektirmeden. Backend erişilemezse çökmek yerine salt-kamu moduna düşüyor.",
  },
  akbilSis: {
    title: "Arnavutköy Akbil — Toplu Ulaşım Simülasyonu",
    category: "Full-Stack",
    description:
      "Bir akbil kartının hayatını uçtan uca simüle eden üç parçalı sistem: mobil uygulamadan kart basılıyor, sunucu ücret kurallarını uyguluyor, belediye hat yoğunluğunu analiz ediyor. Kart basma, ücret hesaplama, bakiye, otobüs simülasyonu ve yoğunluk renk kodlu yönetici görünümüyle yolculuğun tamamını kapsıyor.",
  },
  seyrek: {
    title: "SEYREK — Sesli Masaüstü Asistanı",
    category: "Yapay Zekâ",
    description:
      "Sesle çalışan, çok dilli masaüstü asistanı. Ekrandaki enerji küresine uyandırma kelimesini söylüyorsunuz; hangi dilde olursa olsun dinliyor, Claude tabanlı beyniyle işi yapıyor ve sesli yanıt veriyor. İki süreç, yalnız-loopback ve token doğrulamalı bir WebSocket üzerinden konuşuyor: Python arka uç (ses etkinliği tespiti, uyandırma kelimesi, faster-whisper ile konuşma tanıma, olay veriyolu, durum makinesi orkestratörü, izin koruması arkasında beceri kataloğu, edge-tts ile konuşma) ve WebGL küreyi, altyazıları ve onay kartlarını çizen Electron HUD. Ayrıca kendi kullanımını gözlemleyip geliştirme önerileri üretiyor ve onay verildiğinde bunları kendi koduna kendisi yazıyor.",
  },
  adgs: {
    title: "ADGS — Trafik Video Analiz Sistemi",
    category: "Yapay Zekâ",
    description:
      "Trafik videolarını analiz ederek yol ve altyapı hasarı, kaza ve trafik kural ihlali tespiti yapan karar destek aracı; belediye stajı kapsamında geliştirildi. Kapsamı tercihle değil hukukla çizilmiş: belediyenin trafik cezası kesme yetkisi olmadığı için sistem bakım iş emri, kara nokta planlama verisi ve kanıt paketi üretiyor — ceza değil. Kusur modülü bilinçli olarak yüzde üretmiyor, bunun yerine kaza tespit tutanağının mantığını izliyor. Plaka ve yüz bulanıklaştırma varsayılan olarak açık, ham görüntü ise depoya hiç girmiyor.",
  },
  oftAgents: {
    title: "OFTagents — Claude Code Plugin Marketplace",
    category: "Geliştirici Araçları",
    description:
      "Claude Code için tek bir fikir üzerine kurulu plugin marketplace'i: konvansiyon rica eder, kapı zorlar. Plugin'leri, dokümansız bir projeye kod yazılmasını deterministik olarak imkânsız kılıyor. Bugün üç tanesi yayında — precode (dokümantasyon kapısı), oncode (token faturası) ve postcode (doküman kalitesi) — onları besleyen skill'ler, 237 geçen test ve sıfır çalışma zamanı bağımlılığıyla birlikte. Yeni plugin'ler tek satır kod yazmadan eklenebiliyor.",
  },
  stockPredictions: {
    title: "Yatırım Takip ve Tahmin",
    category: "Veri Bilimi",
    description:
      "Yaklaşık 60 varlığı TL bazında tek ekranda karşılaştıran Streamlit uygulaması — kripto, döviz, kıymetli metaller, petrol, BIST ve ABD hisseleri, dünya endeksleri, konut fiyat endeksleri ve Steam CS2 eşyaları. Her varlık için geçmiş grafik, %80 güven bantlı Prophet tahmini ve 1/3/6/12 aylık hedefler sunuyor. Her tahmin bir doğruluk skoru taşıyor: serinin son 90 günü modelden gizleniyor, tahmin ediliyor ve gerçekleşenle kıyaslanıyor (skor = 100 − MAPE). Veriler yfinance, TCMB EVDS ve Steam pazarından geliyor ve Parquet olarak önbelleğe alınıyor; internet yokken de çalışıyor.",
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
