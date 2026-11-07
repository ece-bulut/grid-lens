"use client";

import { motion } from "motion/react";
import { reveal } from "@/lib/site";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <motion.div {...reveal} className="mb-12 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
      <div>
        <p className="mb-3 text-sm font-medium text-emerald-500">{eyebrow}</p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      </div>
      {description && (
        <p className="text-pretty leading-relaxed text-zinc-400 md:text-[17px]">{description}</p>
      )}
    </motion.div>
  );
}

/** Full-width section separated from the previous one by a hairline rule. */
export function Section({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`border-t border-zinc-800/60 ${className ?? ""}`}>
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-28">{children}</div>
    </section>
  );
}
