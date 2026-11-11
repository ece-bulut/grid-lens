"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/panel";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/site";

type Card = {
  label: string;
  title: string;
  body: string;
  stat: { value: string; caption: string };
  solution?: boolean;
};

const cards: Card[] = [
  {
    label: "Problem",
    title: "Imbalance penalties",
    body: "Wind and solar now exceed 22% of generation. Every forecast error turns into imbalance penalties that come straight out of the producer's margin.",
    stat: { value: "22%+", caption: "Wind and solar share" },
  },
  {
    label: "Problem",
    title: "Delayed company data",
    body: "Investors and analysts only see plant performance in KAP filings, 1-2 months after the quarter has already closed.",
    stat: { value: "1-2 months", caption: "Reporting lag" },
  },
  {
    label: "Approach",
    title: "What GridLens does",
    body: "A bidding engine that minimizes imbalance cost, intraday correction suggestions and weekly company scorecards.",
    stat: { value: "Weekly", caption: "Company scorecards" },
    solution: true,
  },
];

export function Problem() {
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow="Problem"
        title="Forecast error is a financial problem"
        description="As the renewable share grows, every megawatt-hour of deviation shows up on the producer's balance sheet and in what investors can see."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div key={c.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
            <Panel className={cn("flex h-full flex-col", c.solution && "border-emerald-500/30 hover:border-emerald-500/50")}>
              <div className="flex flex-1 flex-col p-6">
                <p className={cn("text-sm", c.solution ? "text-emerald-400" : "text-zinc-500")}>{c.label}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{c.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-zinc-400">{c.body}</p>
              </div>
              <div className="border-t border-zinc-800/80 px-6 py-4">
                <p className="text-2xl font-semibold tracking-tight text-white">{c.stat.value}</p>
                <p className="text-sm text-zinc-500">{c.stat.caption}</p>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
