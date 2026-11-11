"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ProductionChart } from "@/components/production-chart";
import { ActionLink } from "@/components/ui/button";
import { scrollSpring } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export function Hero() {
  const chartRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // The chart settles into place as it enters view: no tilt, glow or blur.
  const { scrollYProgress } = useScroll({ target: chartRef, offset: ["start end", "start 0.25"] });
  const p = useSpring(scrollYProgress, scrollSpring);
  const scale = useTransform(p, [0, 1], [0.97, 1]);
  const opacity = useTransform(p, [0, 0.6], [0.6, 1]);

  return (
    <section className="relative pt-32 md:pt-40">
      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-6xl px-5">
        <motion.p variants={item} className="text-sm text-zinc-400">
          Bilkent University • CS491 Senior Design Project
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[1.04]"
        >
          Multi-Factor Generation, Revenue and Risk Forecasting for Energy Producers
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-pretty leading-relaxed text-zinc-400 md:text-lg">
          Multi-factor generation forecasting, imbalance cost optimization and quarterly revenue
          analysis for electricity producers. Weather, plant availability, grid instructions and
          market prices from EPİAŞ are combined in a single model.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
          <ActionLink href="#layers">
            How it works
            <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </ActionLink>
          <ActionLink href="#results" variant="secondary">
            Early results
          </ActionLink>
        </motion.div>
      </motion.div>

      <div id="chart" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-16 pb-24 md:pb-28">
        <motion.div ref={chartRef} style={reduce ? undefined : { scale, opacity, willChange: "transform, opacity" }}>
          <ProductionChart />
        </motion.div>
      </div>
    </section>
  );
}
