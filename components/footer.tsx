import { GithubIcon, GridLensMark } from "@/components/ui/icons";
import { navLinks, site } from "@/lib/site";

const sources = [
  { label: "EPİAŞ Transparency Platform", href: "https://seffaflik.epias.com.tr" },
  { label: "Open-Meteo", href: "https://open-meteo.com" },
  { label: "KAP (Public Disclosure Platform)", href: "https://www.kap.org.tr" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <GridLensMark className="h-6 w-6" />
            <span className="font-semibold tracking-tight text-white">GridLens</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            Bilkent University CS491 Senior Design Project. Multi-factor generation, revenue and
            risk forecasting for energy producers.
          </p>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">Sections</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-zinc-400 transition-colors hover:text-white">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">Open Data Sources</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {sources.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-zinc-400 transition-colors hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">
            This project is made possible by the open data these institutions publish. Thank you.
          </p>
        </div>
      </div>
      <div className="border-t border-zinc-800/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-zinc-600 sm:flex-row sm:justify-between">
          <p>© 2026 GridLens Team · Bilkent University Department of Computer Engineering</p>
          <p>Academic senior project. Not investment advice.</p>
        </div>
      </div>
    </footer>
  );
}
