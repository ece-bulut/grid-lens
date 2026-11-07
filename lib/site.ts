// TODO: Gerçek repo ve döküman bağlantılarıyla değiştirin.
export const site = {
  name: "GridLens",
  githubUrl: "https://github.com/",
  docsUrl: "#",
};

export const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "AI", href: "#ai" },
  { label: "Early Results", href: "#results" },
  { label: "Team", href: "#team" },
] as const;

export const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Kaydırmaya bağlı değerler için: momentumlu ama salınımsız.
export const scrollSpring = { stiffness: 100, damping: 30, restDelta: 0.001 } as const;

// Ölçülü giriş: kısa mesafe, ease-out, tek sefer.
export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const;
