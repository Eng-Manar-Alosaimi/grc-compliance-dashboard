import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CATEGORIES, categoryPct, type QuarterPack } from "../lib/grc";

const COLORS: Record<string, string> = {
  Q1: "#64748b",
  Q2: "#38bdf8",
  Q3: "#34d399",
};

export default function CategoryChart({ quarters }: { quarters: QuarterPack[] }) {
  const data = CATEGORIES.map((category) => {
    const row: Record<string, string | number> = { category };
    for (const quarter of quarters) {
      row[quarter.id] = Number(categoryPct(quarter.document, category).toFixed(1));
    }
    return row;
  });

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Category Comparison</h2>
        <p className="text-sm text-slate-400">Compliance % by principle across quarters</p>
      </div>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={80}
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 8,
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend />
            {quarters.map((quarter) => (
              <Bar
                key={quarter.id}
                dataKey={quarter.id}
                name={quarter.label}
                fill={COLORS[quarter.id] ?? "#38bdf8"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
