"use client";

import { motion } from "motion/react";
import { Panel } from "@/components/ui/panel";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { reveal } from "@/lib/site";

const members = [
  "Ece Bulut",
  "Ahmet Fatih Öztürk",
  "İzzet Yağızefe Sungurlu",
  "Yunus Tan",
  "Berke İsmail Erhan Asıl",
];

const initials = (name: string) => {
  const parts = name.split(" ");
  return (parts[0][0] + parts[parts.length - 1][0]).toLocaleUpperCase("tr");
};

export function Team() {
  return (
    <Section id="team">
      <SectionHeading eyebrow="Team" title="The people behind GridLens" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {members.map((name, i) => (
          <motion.div key={name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }}>
            <Panel className="h-full p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-200">
                {initials(name)}
              </span>
              <p className="mt-4 text-balance font-medium leading-snug text-white">{name}</p>
              <p className="mt-1 text-sm text-zinc-500">Computer Engineering</p>
            </Panel>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 text-sm text-zinc-500">Bilkent University, Department of Computer Engineering</p>
    </Section>
  );
}
