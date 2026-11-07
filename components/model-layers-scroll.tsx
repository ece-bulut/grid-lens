"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { Metric, Panel, Pill } from "@/components/ui/panel";
import { cn } from "@/lib/cn";
import { scrollSpring } from "@/lib/site";

type Layer = {
  title: string;
  description: string;
  visual: ReactNode;
};

const box = "rounded-md border border-zinc-800/80 bg-ink";

/* ---------- layer illustrations (temsili örnek değerler) ---------- */

function WeatherVisual() {
  return (
    <div className="space-y-3">
      <div className={cn(box, "grid grid-cols-3")}>
        <Metric label="Wind speed" value="9.4" unit="m/s" />
        <Metric label="Direction" value="225" unit="°" />
        <Metric label="Temperature" value="14.0" unit="°C" />
      </div>
      <div className={cn(box, "p-4")}>
        <p className="mb-2 text-xs text-zinc-500">Wind speed forecast, next 48 hours</p>
        <svg viewBox="0 0 300 60" className="h-16 w-full" aria-hidden>
          {[15, 30, 45].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#1f1f23" />)}
          <polyline points="0,40 25,34 50,26 75,24 100,30 125,42 150,38 175,26 200,14 225,12 250,20 275,26 300,24" fill="none" stroke="#06b6d4" strokeWidth="1.75" />
        </svg>
      </div>
    </div>
  );
}

function PlantVisual() {
  return (
    <div className="space-y-3">
      <div className={cn(box, "p-4")}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Available capacity (EAK)</span>
          <span className="font-mono text-zinc-200">92 / 105 MW</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full w-[87.6%] rounded-full bg-zinc-200" />
        </div>
      </div>
      <div className={cn(box, "p-4 text-sm")}>
        <p className="text-zinc-200">“BRS - Gear box arızası, kanat tamiri”</p>
        <p className="mt-0.5 text-xs text-zinc-500">Outage notice: gearbox failure, blade repair</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pill tone="accent">Unplanned</Pill>
          <Pill>Mechanical failure</Pill>
          <Pill>−13 MW</Pill>
        </div>
      </div>
    </div>
  );
}

function GridMarketVisual() {
  const ptf = [42, 38, 35, 33, 36, 48, 62, 74, 70, 58, 52, 66, 80, 92, 86, 72];
  return (
    <div className="space-y-3">
      <div className={cn(box, "grid grid-cols-2 divide-x divide-zinc-800/80")}>
        <Metric label="Down-regulation (YAT)" value="−20" unit="MW" />
        <Metric label="Imbalance risk" value="Medium" unit="14:00-17:00" />
      </div>
      <div className={cn(box, "p-4")}>
        <p className="mb-3 text-xs text-zinc-500">Hourly day-ahead price (PTF), normalized</p>
        <div className="flex h-16 items-end gap-[3px]" aria-hidden>
          {ptf.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className={cn("flex-1 rounded-t-[2px]", h > 75 ? "bg-cyan-400" : "bg-zinc-700")} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OutputVisual() {
  return (
    <div className="space-y-3">
      <div className={cn(box, "p-4")}>
        <p className="mb-2 text-xs text-zinc-500">Net generation forecast with P10-P90 band</p>
        <svg viewBox="0 0 300 80" className="h-20 w-full" aria-hidden>
          {[20, 40, 60].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#1f1f23" />)}
          <path d="M0 42 L50 32 L100 30 L150 56 L200 50 L250 22 L300 26 L300 44 L250 40 L200 70 L150 74 L100 48 L50 50 L0 60Z" fill="rgb(6 182 212 / 0.08)" />
          <polyline points="0,51 50,41 100,39 150,65 200,60 250,31 300,35" fill="none" stroke="#06b6d4" strokeWidth="1.75" />
          <polyline points="0,54 50,45 100,43 150,66 200,63 250,36 300,39" fill="none" stroke="#a1a1aa" strokeWidth="1.25" strokeDasharray="4 4" />
        </svg>
        <div className="mt-2 flex gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-px w-4 bg-cyan-400" /> Forecast</span>
          <span className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-zinc-400" /> Proposed bid</span>
        </div>
      </div>
      <div className={cn(box, "grid grid-cols-2 divide-x divide-zinc-800/80")}>
        <Metric label="Proposed day-ahead bid" value="1,284" unit="MWh" />
        <Metric label="Optimized for" value="Lowest" unit="imbalance cost" />
      </div>
    </div>
  );
}

const layers: Layer[] = [
  {
    title: "Weather",
    description: "Wind speed, direction and temperature enter the model as numerical weather forecasts adjusted to hub height.",
    visual: <WeatherVisual />,
  },
  {
    title: "Plant availability",
    description: "EAK capacity declarations and free-text PMS outage notices are parsed; unplanned mechanical failures are separated out and the capacity loss is calculated.",
    visual: <PlantVisual />,
  },
  {
    title: "Grid and market",
    description: "YAL/YAT dispatch instructions, the day-ahead price (PTF) and imbalance risk determine how much generation reaches the grid and at what price.",
    visual: <GridMarketVisual />,
  },
  {
    title: "Forecast and bid",
    description: "All inputs are combined in one model, which produces a net generation forecast and a day-ahead bid that minimizes the expected imbalance cost.",
    visual: <OutputVisual />,
  },
];

const LAST = layers.length - 1;

/* ---------- stacked card driven by continuous progress ---------- */

function LayerCard({ layer, index, progress }: { layer: Layer; index: number; progress: MotionValue<number> }) {
  // t < 0: henüz gelmedi · t = 0: önde · t > 0: geride (her adımda biraz daha uzak)
  const t = useTransform(progress, (v) => v - index);
  const y = useTransform(t, (v) => (v < 0 ? Math.min(-v, 1) * 120 : -v * 22));
  const scale = useTransform(t, (v) => (v < 0 ? 1 : 1 - v * 0.05));
  const opacity = useTransform(t, (v) => (v < 0 ? Math.max(0, 1 + v * 1.6) : Math.max(0, 1 - v * 0.4)));
  const blur = useTransform(t, (v) => (v <= 0 ? 0 : Math.min(v * 3, 6)));
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      style={{ y, scale, opacity, filter, zIndex: index, transformOrigin: "50% 0%", willChange: "transform, opacity" }}
      className="absolute inset-x-0 top-0"
    >
      <Panel className="bg-ink hover:border-zinc-800/80">
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-3 text-sm">
          <span className="font-medium text-white">{layer.title}</span>
          <span className="text-zinc-500">
            {index + 1} of {layers.length}
          </span>
        </div>
        <div className="p-5">{layer.visual}</div>
      </Panel>
    </motion.div>
  );
}

export function ModelLayersScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, scrollSpring);
  // Son karta biraz fazladan pay: 0 → LAST arası, ardından kısa bir bekleme.
  const progress = useTransform(smooth, [0, 0.88], [0, LAST], { clamp: true });
  const [active, setActive] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(LAST, Math.max(0, Math.round(v)));
    setActive((a) => (a === next ? a : next));
  });

  if (reduce) return <StaticLayers />;

  return (
    <section ref={ref} id="layers" className="relative h-[300vh] border-t border-zinc-800/60">
      <div className="sticky top-20 mx-auto grid h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 px-5 md:grid-cols-[1fr_1.15fr] md:gap-14">
        {/* narrative column */}
        <div className="self-end md:self-center">
          <p className="mb-3 text-sm font-medium text-emerald-500">How the model works</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Four inputs, one forecast
          </h2>

          {/* desktop: full step list */}
          <ol className="mt-10 hidden border-l border-zinc-800 md:block">
            {layers.map((l, i) => (
              <li key={l.title} className="relative pl-5">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 bottom-0 -left-px w-px transition-colors duration-300",
                    i <= active ? "bg-emerald-500" : "bg-transparent",
                  )}
                />
                <div className={cn("py-2.5 transition-opacity duration-300", i === active ? "opacity-100" : "opacity-40")}>
                  <p className="text-sm font-medium text-white">{l.title}</p>
                  <motion.p
                    initial={false}
                    animate={{ height: i === active ? "auto" : 0, opacity: i === active ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="block pt-1.5">{l.description}</span>
                  </motion.p>
                </div>
              </li>
            ))}
          </ol>

          {/* mobile: only the active step */}
          <div className="mt-4 min-h-24 md:hidden">
            <p className="text-sm font-medium text-white">{layers[active].title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{layers[active].description}</p>
          </div>
        </div>

        {/* card stack */}
        <div className="relative h-[340px] self-start md:h-[380px] md:self-center">
          {layers.map((l, i) => (
            <LayerCard key={l.title} layer={l} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Hareket azaltma tercihi için: kaydırma bağlantısı olmayan düz liste. */
function StaticLayers() {
  return (
    <section id="layers" className="border-t border-zinc-800/60">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="mb-10 text-3xl font-semibold tracking-tight text-white md:text-5xl">Four inputs, one forecast</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {layers.map((l) => (
            <Panel key={l.title} className="p-5">
              <p className="mb-1 font-medium text-white">{l.title}</p>
              <p className="mb-5 text-sm text-zinc-400">{l.description}</p>
              {l.visual}
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}
