"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { GithubIcon, GridLensMark } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/lib/site";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-out",
        scrolled || open ? "border-zinc-800/80 bg-ink/90 backdrop-blur-sm" : "border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-3">
          <GridLensMark className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-white">GridLens</span>
          <span className="hidden border-l border-zinc-800 pl-3 text-xs text-zinc-500 sm:inline">CS491 Senior Project</span>
        </a>

        <ul className="hidden items-center lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 text-sm text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 px-3 text-sm text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
          <a
            href={site.docsUrl}
            className="inline-flex h-9 items-center gap-2 rounded-sm bg-zinc-100 px-3.5 text-sm font-medium text-zinc-950 transition-colors duration-200 ease-out hover:bg-white"
          >
            <FileText className="h-4 w-4" />
            Documentation
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center border border-zinc-800 text-zinc-300 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-zinc-800/80 lg:hidden"
          >
            <div className="flex flex-col divide-y divide-zinc-800/60 px-5 py-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-zinc-300 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex gap-2 py-4">
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 border border-zinc-800 text-sm text-zinc-200"
                >
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
                <a
                  href={site.docsUrl}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 bg-zinc-100 text-sm font-medium text-zinc-950"
                >
                  <FileText className="h-4 w-4" /> Documentation
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
