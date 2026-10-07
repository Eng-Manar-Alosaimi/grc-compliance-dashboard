import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Loader2, Play } from "lucide-react";
import { useAssessment } from "../lib/AssessmentContext";
import type { AssessmentDocument } from "../lib/grc";

const FRAMEWORKS = ["SAMA Key Principles of Governance"] as const;
const ASSESS_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/assess`;
export default function UploadPanel() {
  const navigate = useNavigate();
  const { loadDemo, applyAssessmentResult } = useAssessment();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number]>(FRAMEWORKS[0]);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function acceptFile(next: File | undefined) {
    if (!next) return;
    if (next.type !== "application/pdf" && !next.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setError(null);
    setFile(next);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    acceptFile(event.dataTransfer.files[0]);
  }

  async function onAssess(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Select a PDF before running an assessment.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("framework", framework);
      const response = await fetch(ASSESS_URL, { method: "POST", body });
      if (!response.ok) {
        throw new Error(`Assessment failed (${response.status}). Confirm the API is running on port 8000.`);
      }
      const payload = (await response.json()) as AssessmentDocument;
      applyAssessmentResult(payload);
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reach the assessment API.";
      setError(
        message.includes("Failed to fetch")
          ? "Cannot reach http://localhost:8000/assess. Start the API, or load demo data instead."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  function onDemo() {
    loadDemo();
    navigate("/dashboard");
  }

  return (
    <form onSubmit={onAssess} className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">SAMA GRC</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Compliance assessment intake
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Upload a quarterly governance pack and run it against SAMA Key Principles, or load the
          ABC Finance Q1–Q3 demo assessments.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragOver
            ? "border-sky-400 bg-sky-500/10"
            : "border-slate-700 bg-slate-800/60 hover:border-slate-500"
        }`}
      >
        <FileUp className="mx-auto h-10 w-10 text-sky-400" />
        <p className="mt-4 text-sm font-medium text-slate-200">
          {file ? file.name : "Drag and drop a PDF, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-slate-500">PDF evidence pack · max size depends on the API</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
      </div>

      <label className="block text-sm font-medium text-slate-300">
        Framework
        <select
          value={framework}
          onChange={(e) => setFramework(e.target.value as (typeof FRAMEWORKS)[number])}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100"
        >
          {FRAMEWORKS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-card transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run Assessment
        </button>
        <button
          type="button"
          onClick={onDemo}
          className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
        >
          Load Demo Data (Q1, Q2, Q3)
        </button>
      </div>
    </form>
  );
}
