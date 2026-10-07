import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadDemoQuarters,
  type AssessmentDocument,
  type QuarterId,
  type QuarterPack,
} from "./grc";

type AssessmentContextValue = {
  quarters: QuarterPack[];
  hasData: boolean;
  loadDemo: () => void;
  applyAssessmentResult: (document: AssessmentDocument, quarterId?: QuarterId) => void;
  clear: () => void;
};

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

function inferQuarterId(name: string, fallback: QuarterId): QuarterId {
  const upper = name.toUpperCase();
  if (upper.includes("Q1")) return "Q1";
  if (upper.includes("Q2")) return "Q2";
  if (upper.includes("Q3")) return "Q3";
  return fallback;
}

const LABELS: Record<QuarterId, string> = {
  Q1: "Q1 2026",
  Q2: "Q2 2026",
  Q3: "Q3 2026",
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [quarters, setQuarters] = useState<QuarterPack[]>([]);

  const loadDemo = useCallback(() => {
    setQuarters(loadDemoQuarters());
  }, []);

  const applyAssessmentResult = useCallback(
    (document: AssessmentDocument, quarterId?: QuarterId) => {
      const id = quarterId ?? inferQuarterId(document.document_name, "Q3");
      setQuarters((current) => {
        const next = current.filter((item) => item.id !== id);
        next.push({ id, label: LABELS[id], document });
        next.sort((a, b) => a.id.localeCompare(b.id));
        return next;
      });
    },
    [],
  );

  const clear = useCallback(() => setQuarters([]), []);

  const value = useMemo(
    () => ({
      quarters,
      hasData: quarters.length > 0,
      loadDemo,
      applyAssessmentResult,
      clear,
    }),
    [quarters, loadDemo, applyAssessmentResult, clear],
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return ctx;
}
