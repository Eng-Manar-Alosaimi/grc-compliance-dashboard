import q1Data from "../data/q1.json";
import q2Data from "../data/q2.json";
import q3Data from "../data/q3.json";

export type AssessmentStatus = "COMPLIANT" | "PARTIAL" | "GAP" | "NO_EVIDENCE";

export type RawAssessment = {
  id: string;
  requirement: string;
  category: string;
  risk_weight: number;
  criticality: string;
  status: AssessmentStatus;
  evidence: string;
  page: number;
  section: string;
  reason: string;
  recommendation: string;
};

export type HighRiskGap = {
  id: string;
  category: string;
  risk_weight: number;
  reason: string;
};

export type CategoryBreakdown = {
  category: string;
  compliance_pct: number;
  status?: AssessmentStatus | string;
};

export type StatusDistribution = Partial<Record<AssessmentStatus, number>>;

export type Analytics = {
  assessment_score: number;
  risk_weighted_score: number;
  risk_exposure: number;
  evidence_coverage: number;
  total_requirements: number;
  total_gaps: number;
  high_risk_gaps: HighRiskGap[];
  by_category: CategoryBreakdown[];
  status_distribution: StatusDistribution;
};

export type AssessmentDocument = {
  document_name: string;
  total_pages: number;
  raw_assessments: RawAssessment[];
  analytics: Analytics;
};

export type QuarterId = "Q1" | "Q2" | "Q3";

export type QuarterPack = {
  id: QuarterId;
  label: string;
  document: AssessmentDocument;
};

export const CATEGORIES = [
  "Governance Structure",
  "Compliance",
  "Risk Management",
  "Internal Control",
  "Internal Audit",
  "Policy Management",
  "Board Effectiveness",
  "Ethics",
  "Documentation",
  "Remuneration",
] as const;

export const STATUS_ORDER: AssessmentStatus[] = [
  "COMPLIANT",
  "PARTIAL",
  "GAP",
  "NO_EVIDENCE",
];

export const STATUS_COLORS: Record<AssessmentStatus, string> = {
  COMPLIANT: "#22c55e",
  PARTIAL: "#f97316",
  GAP: "#ef4444",
  NO_EVIDENCE: "#94a3b8",
};

export const STATUS_LABELS: Record<AssessmentStatus, string> = {
  COMPLIANT: "Compliant",
  PARTIAL: "Partial",
  GAP: "Gap",
  NO_EVIDENCE: "No Evidence",
};

export function statusCount(
  distribution: StatusDistribution | undefined,
  status: AssessmentStatus,
): number {
  if (!distribution) return 0;
  const value = distribution[status];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function kpiTone(value: number, invert = false): "red" | "orange" | "green" {
  if (invert) {
    if (value <= 0) return "green";
    if (value <= 10) return "orange";
    return "red";
  }
  if (value < 40) return "red";
  if (value <= 70) return "orange";
  return "green";
}

export function loadDemoQuarters(): QuarterPack[] {
  return [
    { id: "Q1", label: "Q1 2026", document: q1Data as AssessmentDocument },
    { id: "Q2", label: "Q2 2026", document: q2Data as AssessmentDocument },
    { id: "Q3", label: "Q3 2026", document: q3Data as AssessmentDocument },
  ];
}

export function latestQuarter(quarters: QuarterPack[]): QuarterPack | undefined {
  return quarters[quarters.length - 1];
}

export function categoryPct(doc: AssessmentDocument, category: string): number {
  const row = doc.analytics.by_category.find((item) => item.category === category);
  if (row && typeof row.compliance_pct === "number") return row.compliance_pct;

  const items = doc.raw_assessments.filter((item) => item.category === category);
  if (items.length === 0) return 0;
  const score = items.reduce((sum, item) => {
    if (item.status === "COMPLIANT") return sum + 100;
    if (item.status === "PARTIAL") return sum + 50;
    return sum;
  }, 0);
  return score / items.length;
}

// ============================================
// Backend Integration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Sends a PDF file to the FastAPI backend for compliance assessment.
 * Returns the assessment data in the same format as the demo JSON files.
 */
export async function runAssessment(file: File): Promise<AssessmentDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/assess`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Assessment failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as AssessmentDocument;
  return data;
}

/**
 * Wraps a live assessment result as a QuarterPack so it can be
 * displayed alongside (or instead of) demo data on the dashboard.
 */
export function liveResultToQuarter(
  doc: AssessmentDocument,
  label = "Live Assessment"
): QuarterPack {
  return {
    id: "Q1" as QuarterId, // placeholder ID
    label,
    document: doc,
  };
}