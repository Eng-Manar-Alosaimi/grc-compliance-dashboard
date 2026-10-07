import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Shield, Upload } from "lucide-react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30"
      : "text-slate-300 hover:bg-slate-800 hover:text-white",
  ].join(" ");

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 p-5 md:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-500/30">
              <Shield className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">SAMA GRC</p>
              <p className="text-xs text-slate-400">Compliance Analytics</p>
            </div>
          </div>
          <nav className="space-y-1">
            <NavLink to="/" end className={navClass}>
              <Upload className="h-4 w-4" />
              Assessment
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          </nav>
          <p className="mt-10 text-xs leading-relaxed text-slate-500">
            Key Principles of Governance — ABC Finance quarterly evidence pack.
          </p>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
              <div className="flex items-center gap-2 md:hidden">
                <Shield className="h-5 w-5 text-sky-400" />
                <span className="text-sm font-semibold">SAMA GRC</span>
              </div>
              <p className="hidden text-sm text-slate-400 md:block">
                Governance, Risk &amp; Compliance
              </p>
              <div className="flex gap-2 md:hidden">
                <NavLink to="/" className={navClass}>
                  Upload
                </NavLink>
                <NavLink to="/dashboard" className={navClass}>
                  Dashboard
                </NavLink>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
