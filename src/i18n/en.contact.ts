/**
 * Contact section copy, including validation and status messages.
 *
 * The message builders take arguments rather than exposing placeholder tokens,
 * so a translation cannot silently drop the number or address it was meant to
 * interpolate — the type signature enforces it.
 */
export const enContact = {
  overline: "Get in touch",
  titleLead: "Contact",
  titleAccent: "Me",
  subtitle:
    "Have a project in mind or just want to say hello? Do not hesitate to get in touch.",
  formTitle: "Send Me a Message",
  infoTitle: "Contact Information",
  socialTitle: "Connect With Me",
  availableTitle: "Available for Work",
  availableBody:
    "I'm currently available for freelance projects and full-time opportunities. Let's discuss how I can help bring your ideas to life.",
  closingTitle: "Let's Work Together",
  poem: [
    "Learning is an endless ocean;",
    "we are engineers navigating with devotion.",
    "Every commit a direction, every bug a notion —",
    "building logic from chaos with structured motion.",
    "Want to join the crew on this journey?",
    "You won't be turned away.",
  ],
  labels: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    phone: "Phone",
    location: "Location",
  },
  placeholders: {
    name: "Your name",
    email: "your.email@example.com",
    subject: "What's this about?",
    message: "Tell me about your project...",
  },
  locationValue: "Istanbul, Turkey",
  submit: "Send Message",
  validation: {
    minChars: (n: number) => `At least ${n} characters.`,
    maxChars: (n: number) => `At most ${n} characters.`,
  },
  status: {
    mailClientOpened: "Opening your mail app — if nothing happens, write to me directly.",
  },
};
