import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type AssessmentStatus,
  type QuarterPack,
} from "../lib/grc";

function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span
      className="rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide"
      style={{
        color: STATUS_COLORS[status],
        backgroundColor: `${STATUS_COLORS[status]}22`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function FindingsAccordion({ quarters }: { quarters: QuarterPack[] }) {
  const [quarterId, setQuarterId] = useState(quarters[quarters.length - 1]?.id ?? "Q1");
  const [openId, setOpenId] = useState<string | null>(null);
  const active = quarters.find((q) => q.id === quarterId) ?? quarters[0];

  const findings = useMemo(() => active?.document.raw_assessments ?? [], [active]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Traceability Drill-down</h2>
          <p className="text-sm text-slate-400">
            {active?.document.document_name} · {findings.length} requirements
          </p>
        </div>
        <label className="text-xs text-slate-400">
          Quarter
          <select
            value={quarterId}
            onChange={(e) => {
              setQuarterId(e.target.value as QuarterPack["id"]);
              setOpenId(null);
            }}
            className="ml-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {quarters.map((quarter) => (
              <option key={quarter.id} value={quarter.id}>
                {quarter.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="space-y-2">
        {findings.map((finding) => {
          const open = openId === finding.id;
          return (
            <div key={finding.id} className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/60">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : finding.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="font-mono text-xs text-sky-300">{finding.id}</span>
                <span className="flex-1 text-sm text-slate-200">{finding.requirement}</span>
                <StatusBadge status={finding.status} />
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open ? (
                <div className="space-y-3 border-t border-slate-800 px-4 py-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-3">
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-500">Category</span>
                      {finding.category}
                    </p>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-500">Page</span>
                      {finding.page}
                    </p>
                    <p>
                      <span className="block text-xs uppercase tracking-wide text-slate-500">Section</span>
                      {finding.section}
                    </p>
                  </div>
                  <p>
                    <span className="block text-xs uppercase tracking-wide text-slate-500">Evidence</span>
                    <span className="text-slate-300">{finding.evidence || "None captured"}</span>
                  </p>
                  <p>
                    <span className="block text-xs uppercase tracking-wide text-slate-500">Reason</span>
                    <span className="text-slate-300">{finding.reason}</span>
                  </p>
                  <p>
                    <span className="block text-xs uppercase tracking-wide text-slate-500">Recommendation</span>
                    <span className="text-slate-300">{finding.recommendation}</span>
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
