import { FileCheck2, Gauge, Scale, TriangleAlert } from "lucide-react";
import { kpiTone, type AssessmentDocument } from "../lib/grc";

const toneClass = {
  red: "text-red-400 bg-red-500/10 ring-red-500/20",
  orange: "text-orange-400 bg-orange-500/10 ring-orange-500/20",
  green: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
};

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function KpiCards({ document }: { document: AssessmentDocument }) {
  const { analytics } = document;
  const cards = [
    {
      label: "Assessment Score",
      value: formatPct(analytics.assessment_score),
      tone: kpiTone(analytics.assessment_score),
      icon: Gauge,
      hint: "Simple average across requirements",
    },
    {
      label: "Risk-Weighted Score",
      value: formatPct(analytics.risk_weighted_score),
      tone: kpiTone(analytics.risk_weighted_score),
      icon: Scale,
      hint: "Weighted by requirement risk",
    },
    {
      label: "Risk Exposure",
      value: String(analytics.risk_exposure),
      tone: kpiTone(analytics.risk_exposure, true),
      icon: TriangleAlert,
      hint: "Aggregate open high-risk residual",
    },
    {
      label: "Evidence Coverage",
      value: formatPct(analytics.evidence_coverage),
      tone: kpiTone(analytics.evidence_coverage),
      icon: FileCheck2,
      hint: "Requirements with supporting evidence",
    },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-xl border border-slate-800 bg-slate-800/70 p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-400">{card.label}</p>
              <span className={`rounded-lg p-2 ring-1 ${toneClass[card.tone]}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className={`mt-4 text-3xl font-semibold tracking-tight ${toneClass[card.tone].split(" ")[0]}`}>
              {card.value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
          </article>
        );
      })}
    </section>
  );
}
