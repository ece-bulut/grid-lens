"use client";

import { memo, useCallback, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/cn";
import { CAPACITY_MW, productionData, type ProductionPoint, type Range } from "@/lib/production-data";

type SeriesKey = "actual" | "forecast" | "plan";

// Hex values mirror the --color-series-* tokens in globals.css. Identity is carried by
// lightness + dash pattern (white solid / cyan solid / gray dashed), never hue alone.
const SERIES: Record<SeriesKey, { label: string; color: string; width: number; dash?: string }> = {
  actual: { label: "Actual generation", color: "#f4f4f5", width: 1.75 },
  forecast: { label: "GridLens forecast", color: "#06b6d4", width: 2 },
  plan: { label: "Operator KGÜP", color: "#71717a", width: 1.25, dash: "4 4" },
};
const ORDER: SeriesKey[] = ["actual", "forecast", "plan"];
const AXIS = { fill: "#52525b", fontSize: 10, fontFamily: "var(--font-geist-mono)" };

// Labels are "Sun 14:00". The 24-hour view shows only the time; the weekly view only the day.
const timeOnly = (l: string) => l.split(" ")[1];
const dayOnly = (l: string) => l.split(" ")[0];

const RANGES: { value: Range; label: string; subtitle: string; tickEvery: number; tick: (l: string) => string }[] = [
  { value: 24, label: "24 Hours", subtitle: "24-hour generation actuals and model comparison", tickEvery: 2, tick: timeOnly },
  { value: 48, label: "48 Hours", subtitle: "48-hour generation actuals and model comparison", tickEvery: 5, tick: (l) => l },
  { value: 168, label: "Weekly", subtitle: "7-day generation actuals and model comparison", tickEvery: 23, tick: dayOnly },
];

type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
};

function ChartTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-52 rounded-md border border-zinc-700 bg-ink/95 text-xs shadow-xl">
      <p className="border-b border-zinc-800 px-3 py-1.5 font-mono text-zinc-500">{label}</p>
      <ul className="space-y-1 px-3 py-2">
        {payload.map((p) => {
          const key = p.dataKey as SeriesKey;
          const s = SERIES[key];
          if (!s) return null;
          return (
            <li key={key} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-zinc-400">
                <SeriesSwatch k={key} />
                {s.label}
              </span>
              <span className="font-mono tabular-nums text-zinc-100">{Number(p.value).toFixed(1)} MW</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SeriesSwatch({ k, dim }: { k: SeriesKey; dim?: boolean }) {
  const s = SERIES[k];
  return (
    <svg width="16" height="6" aria-hidden>
      <line x1="0" y1="3" x2="16" y2="3" stroke={s.color} strokeWidth="2" strokeDasharray={s.dash ? "3 2" : undefined} opacity={dim ? 0.3 : 1} />
    </svg>
  );
}

type PlotProps = {
  data: ProductionPoint[];
  visible: Record<SeriesKey, boolean>;
  tickEvery: number;
  tick: (label: string) => string;
};

const tooltipContent = <ChartTooltip />;

// Pure component: redraws only when data, series visibility or range change, so other
// parent renders (e.g. toggling the table) never make Recharts recompute.
const ChartPlot = memo(function ChartPlot({ data, visible, tickEvery, tick }: PlotProps) {
  return (
    <div className="h-[260px] w-full md:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 16, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#1f1f23" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#27272a" }} tick={AXIS} tickFormatter={tick} interval={tickEvery} dy={8} />
          <YAxis
            domain={[0, 110]}
            ticks={[0, 25, 50, 75, 105]}
            tickLine={false}
            axisLine={false}
            tick={AXIS}
            unit=" MW"
            width={60}
          />
          <ReferenceLine
            y={CAPACITY_MW}
            stroke="#3f3f46"
            strokeDasharray="2 4"
            label={{ value: "Installed capacity", position: "insideTopRight", fill: "#71717a", fontSize: 11 }}
          />
          <Tooltip content={tooltipContent} cursor={{ stroke: "#3f3f46", strokeWidth: 1 }} />
          {ORDER.map((k) =>
            visible[k] ? (
              <Line
                key={k}
                type="linear"
                dataKey={k}
                stroke={SERIES[k].color}
                strokeWidth={SERIES[k].width}
                strokeDasharray={SERIES[k].dash}
                dot={false}
                activeDot={{ r: 3, stroke: "#090a0f", strokeWidth: 2, fill: SERIES[k].color }}
                isAnimationActive={false}
              />
            ) : null,
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

// Takes no props, so memo keeps the chart from redrawing on parent renders.
export const ProductionChart = memo(function ProductionChart() {
  const [range, setRange] = useState<Range>(24);
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({ actual: true, forecast: true, plan: true });
  const [showTable, setShowTable] = useState(false);
  const data = productionData[range];
  const current = RANGES.find((r) => r.value === range)!;

  const toggle = useCallback(
    (k: SeriesKey) =>
      setVisible((v) => {
        const next = { ...v, [k]: !v[k] };
        return Object.values(next).some(Boolean) ? next : v; // keep at least one series visible
      }),
    [],
  );

  return (
    <Panel className="bg-ink hover:border-zinc-800/80">
      <div className="p-5 md:p-7">
        {/* title + range */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">Şah RES (105 MW) — Balıkesir</h3>
            <p className="mt-1 text-sm text-zinc-400">{current.subtitle}</p>
          </div>

          <div className="inline-flex self-start rounded-md border border-zinc-800 p-0.5 text-sm" role="group" aria-label="Time range">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                aria-pressed={range === r.value}
                className={cn(
                  "rounded-[5px] px-3 py-1.5 transition-colors duration-200",
                  range === r.value ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* legend doubles as series filter */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              aria-pressed={visible[k]}
              className={cn(
                "inline-flex items-center gap-2 transition-colors duration-200",
                visible[k] ? "text-zinc-300 hover:text-white" : "text-zinc-600",
              )}
            >
              <SeriesSwatch k={k} dim={!visible[k]} />
              {SERIES[k].label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <ChartPlot data={data} visible={visible} tickEvery={current.tickEvery} tick={current.tick} />
        </div>

        {showTable && (
          <div data-lenis-prevent className="mt-4 max-h-64 overflow-auto rounded-md border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Time</th>
                  {ORDER.map((k) => (
                    <th key={k} className="px-3 py-2 text-right font-medium">{SERIES[k].label} (MW)</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums text-zinc-300">
                {data.map((d) => (
                  <tr key={d.label} className="border-t border-zinc-800/60">
                    <td className="px-3 py-1.5 text-zinc-500">{d.label}</td>
                    <td className="px-3 py-1.5 text-right">{d.actual.toFixed(1)}</td>
                    <td className="px-3 py-1.5 text-right">{d.forecast.toFixed(1)}</td>
                    <td className="px-3 py-1.5 text-right">{d.plan.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 border-t border-zinc-800/60 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Illustrative data. KGÜP: the operator&apos;s finalized day-ahead production plan, published by EPİAŞ.</p>
          <button
            type="button"
            onClick={() => setShowTable((s) => !s)}
            aria-expanded={showTable}
            className="self-start rounded-sm text-zinc-400 underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-zinc-500 sm:self-auto"
          >
            {showTable ? "Hide data table" : "Show data table"}
          </button>
        </div>
      </div>
    </Panel>
  );
});
