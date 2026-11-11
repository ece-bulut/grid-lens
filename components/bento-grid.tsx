"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";
import { Metric, Panel, Pill } from "@/components/ui/panel";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { reveal } from "@/lib/site";

/* ---------- shell ---------- */

function Module({
  title,
  body,
  source,
  children,
  className,
  id,
  delay = 0,
}: {
  title: string;
  body: string;
  source: string;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay }} id={id} className={cn("scroll-mt-24", className)}>
      <Panel className="flex h-full flex-col">
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
          <div className="mt-6 flex-1">{children}</div>
        </div>
        <p className="border-t border-zinc-800/80 px-6 py-3 text-xs text-zinc-500">{source}</p>
      </Panel>
    </motion.div>
  );
}

const box = "rounded-md border border-zinc-800/80 bg-ink";

/* ---------- module illustrations (temsili değerler) ---------- */

function WeatherMock() {
  const rows = [
    { t: "06:00", ws: 7.8, wd: 210 },
    { t: "09:00", ws: 9.4, wd: 225 },
    { t: "12:00", ws: 11.2, wd: 232 },
    { t: "15:00", ws: 8.6, wd: 240 },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
      <div className={cn(box, "grid grid-cols-2")}>
        <Metric label="Wind speed (100 m)" value="9.4" unit="m/s" />
        <Metric label="Direction" value="225" unit="°" />
        <Metric label="Temperature" value="14.0" unit="°C" className="border-t border-zinc-800/80" />
        <Metric label="Irradiance" value="412" unit="W/m²" className="border-t border-zinc-800/80" />
      </div>
      <div className={cn(box, "overflow-x-auto")}>
        <table className="w-full text-xs">
          <thead className="text-zinc-500">
            <tr className="border-b border-zinc-800/80">
              <th className="px-3 py-2 text-left font-medium">Hour</th>
              <th className="px-3 py-2 text-right font-medium">m/s</th>
              <th className="px-3 py-2 text-right font-medium">Dir.</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums text-zinc-300">
            {rows.map((r) => (
              <tr key={r.t} className="border-b border-zinc-800/40 last:border-0">
                <td className="px-3 py-1.5 text-zinc-500">{r.t}</td>
                <td className="px-3 py-1.5 text-right">{r.ws.toFixed(1)}</td>
                <td className="px-3 py-1.5 text-right">{r.wd}°</td>
                <td className="px-3 py-1.5">
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-cyan-400" style={{ transform: `rotate(${r.wd}deg)` }} aria-hidden>
                    <path d="M6 1v10M6 1 3.5 4M6 1l2.5 3" stroke="currentColor" strokeWidth="1.25" fill="none" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PmsMock() {
  return (
    <div className="space-y-2 text-sm">
      <div className={cn(box, "px-4 py-3")}>
        <p className="text-xs text-zinc-500">Outage notice (original, Turkish)</p>
        <p className="mt-1 text-zinc-200">“BRS - Gear box arızası, kanat tamiri”</p>
        <p className="mt-0.5 text-xs text-zinc-500">Gearbox failure, blade repair</p>
      </div>
      <div className="flex justify-center py-0.5 text-zinc-600">
        <ArrowDown className="h-4 w-4" />
      </div>
      <div className={cn(box, "divide-y divide-zinc-800/80")}>
        {[
          ["Category", "Mechanical failure"],
          ["Planned / unplanned", "Unplanned"],
          ["Components", "Gearbox, blade"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2">
            <span className="text-zinc-500">{k}</span>
            <span className={k === "Planned / unplanned" ? "text-emerald-400" : "text-zinc-200"}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BidMock() {
  // Asimetrik kayıp: eksik üretim (negatif sapma) fazla üretimden daha pahalı.
  return (
    <div className="space-y-3">
      <div className={cn(box, "p-2")}>
        <svg viewBox="0 0 240 112" className="w-full" aria-label="Imbalance cost by deviation: shortfall costs more than surplus">
          {[20, 45, 70].map((y) => (
            <line key={y} x1="20" x2="232" y1={y} y2={y} stroke="#1f1f23" />
          ))}
          <line x1="126" y1="10" x2="126" y2="95" stroke="#3f3f46" strokeDasharray="2 3" />
          <line x1="20" y1="95" x2="232" y2="95" stroke="#3f3f46" />
          <path d="M24 16 L126 95 L232 58" fill="none" stroke="#06b6d4" strokeWidth="1.75" />
          <text x="24" y="107" fill="#71717a" fontSize="9">Shortfall</text>
          <text x="196" y="107" fill="#71717a" fontSize="9">Surplus</text>
          <text x="131" y="18" fill="#71717a" fontSize="9">Cost (TRY)</text>
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-zinc-400">
        Producing less than the bid is penalized more heavily than producing more, so the best
        bid is not simply the expected generation.
      </p>
    </div>
  );
}

function NowcastMock() {
  // Çeyrek içi haftalık üretim; gerçekleşen (dolu) ve kalan haftalar için tahmin (taralı).
  const weeks = [6, 7, 5, 8, 7, 9, 6, 8, 7, 8, 9, 7, 6];
  const done = 8;
  return (
    <div className="space-y-3">
      <div className={cn(box, "p-4")}>
        <div className="mb-3 flex justify-between text-xs text-zinc-500">
          <span>Weekly generation, current quarter</span>
          <span>Week {done} of 13</span>
        </div>
        <div className="flex h-20 items-end gap-[3px]" aria-hidden>
          {weeks.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h * 10}%` }}
              className={cn(
                "flex-1 rounded-t-[2px]",
                i < done
                  ? "bg-zinc-300"
                  : "border border-dashed border-cyan-400/70 bg-[repeating-linear-gradient(135deg,rgb(34_211_238/0.18)_0_2px,transparent_2px_5px)]",
              )}
            />
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-zinc-300" /> Actual</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm border border-dashed border-cyan-400" /> Estimate</span>
        </div>
      </div>
      <div className={cn(box, "grid grid-cols-2 divide-x divide-zinc-800/80")}>
        <Metric label="KAP filing" value="30-60" unit="days after quarter end" />
        <Metric label="GridLens" value="Weekly" unit="during the quarter" />
      </div>
    </div>
  );
}

function AssistantMock() {
  return (
    <div className="space-y-3 text-sm">
      <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-zinc-800 px-4 py-2.5 text-zinc-100">
        Why did Galata Wind produce less than expected last month?
      </div>
      <div className={cn(box, "max-w-[92%] px-4 py-3")}>
        <p className="leading-relaxed text-zinc-300">
          The shortfall is broken down into reported outages, grid curtailment instructions and
          weather deviation, with each figure linked to its source.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pill>EPİAŞ real-time generation</Pill>
          <Pill>PMS outage notices</Pill>
          <Pill>GridLens forecast</Pill>
        </div>
      </div>
    </div>
  );
}

function BatteryMock() {
  const hours = [0.2, 0.15, 0.1, 0.12, 0.25, 0.45, 0.7, 0.8, 0.6, 0.4, 0.35, 0.5, 0.75, 0.95, 0.85, 0.6];
  return (
    <div className={cn(box, "p-4")}>
      <p className="mb-3 text-xs text-zinc-500">Hourly day-ahead price (PTF), normalized</p>
      <div className="flex h-16 items-end gap-[3px]" aria-hidden>
        {hours.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h * 100}%` }}
            className={cn("flex-1 rounded-t-[2px]", h > 0.7 ? "bg-cyan-400" : h < 0.2 ? "bg-emerald-500" : "bg-zinc-700")}
          />
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> Charge at low prices</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-cyan-400" /> Discharge at high prices</span>
      </div>
    </div>
  );
}

/* ---------- grid ---------- */

export function BentoGrid() {
  return (
    <Section id="solution">
      <SectionHeading
        eyebrow="System"
        title="Six components, one data model"
        description="Each component handles one input or decision. All of them read from the same EPİAŞ and weather data and feed the same forecasting model."
      />

      <div className="grid gap-4 md:grid-cols-12">
        <Module
          className="md:col-span-7"
          title="Weather data"
          body="Hourly wind speed, direction and irradiance forecasts, adjusted to turbine hub height."
          source="Source: Open-Meteo · hourly · 0-48 h ahead"
        >
          <WeatherMock />
        </Module>

        <Module
          className="md:col-span-5"
          delay={0.05}
          title="Outage notice parser"
          body="Reads free-text PMS and EAK notices and classifies them, for example as an unplanned mechanical failure."
          source="Source: EPİAŞ PMS notices"
        >
          <PmsMock />
        </Module>

        <Module
          className="md:col-span-5"
          title="Bid optimization"
          body="Optimizes the day-ahead bid against the imbalance cost in TRY rather than the forecast error in MWh."
          source="Inputs: generation forecast, PTF and SMF prices"
        >
          <BidMock />
        </Module>

        <Module
          className="md:col-span-7"
          delay={0.05}
          title="Quarterly revenue estimate"
          body="Company-level generation and revenue estimates while the quarter is still running, published as a weekly scorecard."
          source="Sources: EPİAŞ generation data, KAP filings"
        >
          <NowcastMock />
        </Module>

        <Module
          id="ai"
          className="md:col-span-7"
          title="Energy assistant"
          body="Answers natural-language questions by querying EPİAŞ and model data, and cites the data behind each answer."
          source="Data: EPİAŞ, PMS notices, GridLens forecasts"
        >
          <AssistantMock />
        </Module>

        <Module
          className="md:col-span-5"
          delay={0.05}
          title="Battery storage scenarios"
          body="Arbitrage and scenario analysis for storage, in line with Turkey's 33 GW storage target."
          source="Input: hourly PTF price profiles"
        >
          <BatteryMock />
        </Module>
      </div>
    </Section>
  );
}
