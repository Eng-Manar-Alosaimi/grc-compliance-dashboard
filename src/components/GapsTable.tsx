import type { QuarterPack } from "../lib/grc";

export default function GapsTable({ quarters }: { quarters: QuarterPack[] }) {
  const rows = quarters.flatMap((quarter) =>
    (quarter.document.analytics.high_risk_gaps ?? []).map((gap) => ({
      ...gap,
      quarter: quarter.id,
      label: quarter.label,
    })),
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">High-Risk Gaps</h2>
        <p className="text-sm text-slate-400">Open gaps with elevated risk weight by quarter</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Quarter</th>
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Risk Weight</th>
              <th className="px-3 py-2 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                  No high-risk gaps in the loaded quarters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.quarter}-${row.id}`} className="border-b border-slate-800/80">
                  <td className="whitespace-nowrap px-3 py-3 text-sky-300">{row.label}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-slate-200">{row.id}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-slate-300">{row.category}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-300 ring-1 ring-red-500/20">
                      {row.risk_weight}
                    </span>
                  </td>
                  <td className="max-w-xl px-3 py-3 text-slate-400">{row.reason}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
