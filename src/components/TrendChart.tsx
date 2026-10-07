import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuarterPack } from "../lib/grc";

export default function TrendChart({ quarters }: { quarters: QuarterPack[] }) {
  const data = quarters.map((q) => ({
    quarter: q.label,
    assessment: q.document.analytics.assessment_score,
    riskWeighted: q.document.analytics.risk_weighted_score,
  }));

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Score Trend</h2>
        <p className="text-sm text-slate-400">Assessment vs risk-weighted score by quarter</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
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
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="assessment"
              name="Assessment Score"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="riskWeighted"
              name="Risk-Weighted Score"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
