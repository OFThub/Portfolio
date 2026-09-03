import type { enContact } from "./en.contact";

/**
 * Turkish contact copy. The type annotation forces every message builder to
 * keep its parameters, so a translation cannot quietly drop the interpolated
 * count or address.
 */
export const trContact: typeof enContact = {
  overline: "İletişime geç",
  titleLead: "Bana",
  titleAccent: "Ulaşın",
  subtitle:
    "Aklınızda bir proje mi var, yoksa sadece merhaba mı demek istiyorsunuz? Çekinmeden yazın.",
  formTitle: "Bana Mesaj Gönder",
  infoTitle: "İletişim Bilgileri",
  socialTitle: "Benimle Bağlantı Kur",
  availableTitle: "Yeni Projelere Açığım",
  availableBody:
    "Şu anda freelance projelere ve tam zamanlı fırsatlara açığım. Fikirlerinizi hayata geçirmek için nasıl yardımcı olabileceğimi konuşalım.",
  closingTitle: "Birlikte Çalışalım",
  poem: [
    "Öğrenmek uçsuz bucaksız bir okyanus;",
    "biz de onda yol alan mühendisleriz.",
    "Her commit bir yön, her hata bir ders —",
    "kaostan düzenli bir mantık kurarız.",
    "Bu yolculukta mürettebata katılmak ister misin?",
    "Kapımız herkese açık.",
  ],
  labels: {
    name: "Ad",
    email: "E-posta",
    subject: "Konu",
    message: "Mesaj",
    phone: "Telefon",
    location: "Konum",
    company: "Şirket",
  },
  placeholders: {
    name: "Adınız",
    email: "eposta@ornek.com",
    subject: "Konu nedir?",
    message: "Projenizden bahsedin...",
  },
  locationValue: "İstanbul, Türkiye",
  submit: "Mesajı Gönder",
  submitting: "Gönderiliyor...",
  submitDisabled: "Kullanılamıyor",
  validation: {
    spam: "Spam tespit edildi.",
    tooFast: "Çok hızlı oldu — biraz zaman ayırın.",
    minChars: (n: number) => `En az ${n} karakter.`,
    maxChars: (n: number) => `En fazla ${n} karakter.`,
    looksSpammy: "Bu mesaj spam gibi görünüyor.",
    rateLimited: (seconds: number) => `Tekrar göndermek için ${seconds} sn bekleyin.`,
  },
  status: {
    success: "Mesaj gönderildi — ulaştığınız için teşekkürler!",
    formDisabled: (email: string) =>
      `Form şu anda kullanılamıyor — bana ${email} adresinden ulaşabilirsiniz.`,
    sendFailed: (email: string) => `Gönderilemedi. Doğrudan ${email} adresine yazabilirsiniz.`,
  },
};
