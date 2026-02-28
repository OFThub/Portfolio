"use client";

import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, Youtube } from "lucide-react";
import emailjs from "@emailjs/browser";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  // Honeypot (bots usually fill this)
  const [hp, setHp] = useState("");
  // Time-based bot check
  const [formStartTs] = useState(() => Date.now());

  // Limits
  const MIN_MSG = 30;
  const MAX_MSG = 1500;
  const MIN_SUBJECT = 3;
  const MAX_SUBJECT = 120;

  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        label: "Email",
        value: "oturkdogdu1@gmail.com",
        link: "mailto:oturkdogdu1@gmail.com",
      },
      {
        icon: Phone,
        label: "Phone",
        value: "+90 551 682 34 80",
        link: "tel:+905516823480",
      },
      {
        icon: MapPin,
        label: "Location",
        value: "Istanbul, Turkey",
        link: null as string | null,
      },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        icon: Github,
        label: "GitHub",
        link: "https://github.com/OFThub/",
        color: "hover:text-white",
      },
      {
        icon: Linkedin,
        label: "LinkedIn",
        link: "https://www.linkedin.com/in/omerfarukoft/",
        color: "hover:text-blue-500",
      },
      {
        icon: Instagram,
        label: "Instagram",
        link: "https://www.instagram.com/omerfaruk.oft/",
        color: "hover:text-pink-500",
      },
      {
        icon: Youtube,
        label: "YouTube",
        link: "https://www.youtube.com/@oft.omerfaruk",
        color: "hover:text-red-500",
      }
    ],
    []
  );

  const countLinks = (s: string) => (s.match(/https?:\/\//gi) || []).length;

  const looksSpammy = (s: string) => {
    // excessive repeated chars: aaaaaaaa / !!!!!!!!!! / ..........
    if (/(.)\1{8,}/.test(s)) return true;
    // too many links
    if (countLinks(s) > 2) return true;
    return false;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const subj = formData.subject.trim();
    const msg = formData.message.trim();

    // honeypot
    if (hp.trim().length > 0) e._ = "Spam tespit edildi.";
    // too fast submit
    if (Date.now() - formStartTs < 2500) e._ = "Çok hızlı gönderim (bot kontrolü).";

    if (subj.length < MIN_SUBJECT) e.subject = `Konu en az ${MIN_SUBJECT} karakter olmalı.`;
    if (subj.length > MAX_SUBJECT) e.subject = `Konu en fazla ${MAX_SUBJECT} karakter olmalı.`;

    if (msg.length < MIN_MSG) e.message = `Mesaj en az ${MIN_MSG} karakter olmalı.`;
    if (msg.length > MAX_MSG) e.message = `Mesaj en fazla ${MAX_MSG} karakter olmalı.`;

    if (looksSpammy(`${subj} ${msg}`)) e.message = "Mesaj spam gibi görünüyor (çok link/tekrar).";

    return e;
  };

  const canSendNow = () => {
    const key = "contact_last_sent_ts";
    const last = Number(localStorage.getItem(key) || "0");
    const now = Date.now();
    const cooldownMs = 60_000; // 60 seconds

    if (now - last < cooldownMs) {
      return { ok: false, waitSec: Math.ceil((cooldownMs - (now - last)) / 1000) };
    }
    localStorage.setItem(key, String(now));
    return { ok: true, waitSec: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage({ type: "", text: "" });

    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setStatus("error");
      if (v._) setMessage({ type: "error", text: v._ });
      return;
    }

    const rl = canSendNow();
    if (!rl.ok) {
      setStatus("error");
      setMessage({ type: "error", text: `Çok sık gönderim. ${rl.waitSec} sn sonra tekrar deneyin.` });
      return;
    }

    setSending(true);
    setStatus("loading");

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          reply_to: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      );

      setStatus("success");
      setMessage({ type: "success", text: "Mesajınız başarıyla gönderildi!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setHp("");

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("EMAILJS ERROR:", err);
      setStatus("error");
      setMessage({
        type: "error",
        text: `Gönderim başarısız: ${err?.text || err?.message || "Bilinmeyen hata"}`,
      });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="text-white">Contact</span>{" "}
            <span className="text-primary">Me</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or just want to say hello? Don’t hesitate to get in touch.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="p-8 bg-card border border-primary/20 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Send Me a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot (hidden) */}
                <div className="hidden" aria-hidden="true">
                  <label>
                    Company
                    <input
                      type="text"
                      name="company"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    minLength={MIN_SUBJECT}
                    maxLength={MAX_SUBJECT}
                    className="w-full px-4 py-3 bg-secondary border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder="What's this about?"
                  />
                  {errors.subject && <p className="text-red-400 text-sm mt-2">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    minLength={MIN_MSG}
                    maxLength={MAX_MSG}
                    className="w-full px-4 py-3 bg-secondary border border-primary/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>
                      {errors.message ? (
                        <span className="text-red-400">{errors.message}</span>
                      ) : (
                        <>En az {MIN_MSG} karakter</>
                      )}
                    </span>
                    <span>
                      {formData.message.length}/{MAX_MSG}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending || status === "loading"}
                  className="w-full px-6 py-4 bg-primary hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>{sending ? "Sending..." : "Send Message"}</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Success / Error */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center border ${
                      message.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="p-8 bg-card border border-primary/20 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{info.label}</p>
                      {info.link ? (
                        <a href={info.link} className="text-white hover:text-primary transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-8 bg-card border border-primary/20 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    className={`p-4 bg-secondary border border-primary/20 rounded-lg hover:border-primary/50 transition-all duration-300 flex items-center gap-3 group ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="text-gray-300 group-hover:text-inherit transition-colors">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white font-bold">Available for Work</span>
              </div>
              <p className="text-gray-400">
                I'm currently available for freelance projects and full-time opportunities. Let's discuss how I can help
                bring your ideas to life!
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-card border border-primary/20 rounded-lg text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Let's Work Together</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Learning is an endless ocean;
            we are engineers navigating with devotion.<br></br>
            Every commit a direction, every bug a notion
            building logic from chaos with structured motion.<br></br>
            <br></br>
            Want to join the crew on this journey?<br></br>
            You won’t be turned away.<br></br>
          </p>
        </motion.div>
      </div>
    </section>
  );
}