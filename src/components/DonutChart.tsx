import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_ORDER,
  statusCount,
  type QuarterPack,
} from "../lib/grc";

export default function DonutChart({ quarters }: { quarters: QuarterPack[] }) {
  const [activeId, setActiveId] = useState(quarters[quarters.length - 1]?.id ?? "Q1");
  const active = quarters.find((q) => q.id === activeId) ?? quarters[0];

  const data = useMemo(() => {
    const dist = active?.document.analytics.status_distribution;
    return STATUS_ORDER.map((status) => ({
      status,
      name: STATUS_LABELS[status],
      value: statusCount(dist, status),
      color: STATUS_COLORS[status],
    }));
  }, [active]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="scroll-mt-24 rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Status Distribution</h2>
          <p className="text-sm text-slate-400">{active?.label} requirement outcomes</p>
        </div>
        <div className="flex rounded-lg bg-slate-900 p-1 ring-1 ring-slate-700">
          {quarters.map((quarter) => (
            <button
              key={quarter.id}
              type="button"
              onClick={() => setActiveId(quarter.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                quarter.id === activeId
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {quarter.id}
            </button>
          ))}
        </div>
      </div>
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2 text-sm">
          {data.map((item) => (
            <li key={item.status} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-medium text-white">
                {item.value}
                <span className="ml-1 text-xs text-slate-500">
                  {total ? `(${Math.round((item.value / total) * 100)}%)` : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
