"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/panel";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { reveal } from "@/lib/site";

type MetricCard = {
  label: string;
  value: number;
  note: string;
  bar: string; // same encoding as the production chart
};

const metrics: MetricCard[] = [
  {
    label: "Persistence baseline",
    value: 22.1,
    note: "Naive reference: each hour is forecast as the previous hour's generation.",
    bar: "bg-zinc-600",
  },
  {
    label: "GridLens first model",
    value: 11.2,
    note: "Error cut roughly in half compared with the baseline.",
    bar: "bg-cyan-400",
  },
  {
    label: "Operator's KGÜP plan",
    value: 7.0,
    note: "Target: close this gap by adding outage and curtailment data.",
    bar: "bg-[repeating-linear-gradient(90deg,#a1a1aa_0_6px,transparent_6px_10px)]",
  },
];
const MAX = 25;

export function Results() {
  return (
    <Section id="results">
      <SectionHeading
        eyebrow="Early results"
        title="First test on Şah RES"
        description="Forecast error relative to installed capacity; lower is better. The first model halved the baseline error. The next step is adding outage and grid curtailment data."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((m, i) => (
          <motion.div key={m.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
            <Panel className="flex h-full flex-col">
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-zinc-400">{m.label}</p>
                <p className="mt-3 text-5xl font-semibold tracking-tight text-white">
                  <span className="font-mono tabular-nums">{m.value.toFixed(1)}</span>
                  <span className="text-zinc-500">%</span>
                </p>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(m.value / MAX) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
                    className={`h-full rounded-full ${m.bar}`}
                  />
                </div>
              </div>
              <p className="border-t border-zinc-800/80 px-6 py-4 text-sm leading-relaxed text-zinc-400">{m.note}</p>
            </Panel>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
