import { Link } from "react-router-dom";
import CategoryChart from "../components/CategoryChart";
import DonutChart from "../components/DonutChart";
import FindingsAccordion from "../components/FindingsAccordion";
import GapsTable from "../components/GapsTable";
import KpiCards from "../components/KpiCards";
import TrendChart from "../components/TrendChart";
import { useAssessment } from "../lib/AssessmentContext";
import { latestQuarter } from "../lib/grc";

export default function DashboardPage() {
  const { quarters, hasData } = useAssessment();
  const latest = latestQuarter(quarters);

  if (!hasData || !latest) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-10 text-center shadow-card">
        <h1 className="text-xl font-semibold text-white">No assessment loaded</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          Run an assessment against a PDF pack, or load the Q1–Q3 demo data to populate this
          dashboard.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          Go to intake
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Compliance dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Latest pack: {latest.document.document_name} · {latest.label} ·{" "}
            {latest.document.analytics.total_requirements} requirements ·{" "}
            {latest.document.analytics.total_gaps} gaps
          </p>
        </div>
      </div>
      <KpiCards document={latest.document} />
      <TrendChart quarters={quarters} />
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CategoryChart quarters={quarters} />
        </div>
        <div className="xl:col-span-2">
          <DonutChart quarters={quarters} />
        </div>
      </div>
      <GapsTable quarters={quarters} />
      <FindingsAccordion quarters={quarters} />
    </div>
  );
}
