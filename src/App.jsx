import React, { useState, createContext, useContext, useEffect } from "react";
import { LayoutDashboard, DollarSign, Users, FileText, Settings, Search, Bell, ChevronLeft, ChevronRight, Sun, Moon, LogOut } from "lucide-react";

import { ExecutiveDashboard } from "./modules/Dashboard";
import { FinancialModule } from "./modules/Financial";
import { HRModule } from "./modules/HR";
import { ContractsModule } from "./modules/Contracts";
import { SettingsModule } from "./modules/Settings";
import { mockData } from "./mockData";
import { AlertItem } from "./components/Shared";

export const ThemeCtx = createContext();
export const useTheme = () => useContext(ThemeCtx);

function ThemeToggle() {
  const { dark, setDark } = useTheme();
  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative flex items-center p-1 rounded-full border border-slate-200 dark:border-slate-700 bg-amber-100 dark:bg-slate-800 transition-colors shadow-inner shrink-0"
      aria-label="Toggle theme"
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-transform ${!dark ? 'text-amber-600' : 'text-slate-400 scale-75'}`}>
        <Sun size={16} />
      </span>
      <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-transform ${dark ? 'text-blue-400' : 'text-slate-400 scale-75'}`}>
        <Moon size={16} />
      </span>
      <span className={`absolute w-7 h-7 rounded-full bg-white dark:bg-blue-600 shadow transition-all duration-300 ${dark ? 'left-[calc(100%-32px)]' : 'left-1'}`} />
    </button>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedSite, setSelectedSite] = useState("All Sites");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  const modules = [
    { id: "dashboard", label: "Executive Dashboard", icon: <LayoutDashboard size={18} />, badge: null },
    { id: "financial", label: "Financial", icon: <DollarSign size={18} />, badge: null },
    { id: "hr", label: "People & HR", icon: <Users size={18} />, badge: "3" },
    { id: "contracts", label: "Contracts", icon: <FileText size={18} />, badge: "2" },
    { id: "settings", label: "Access & Settings", icon: <Settings size={18} />, badge: null },
  ];

  const moduleTitle = {
    dashboard: "Executive Dashboard",
    financial: "Financial Command Center",
    hr: "People & HR Operations",
    contracts: "Contract Lifecycle Management",
    settings: "Access & Settings",
  };

  return (
    <ThemeCtx.Provider value={{ dark, setDark, t: {} }}>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#080E1C] text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 overflow-hidden w-full">

        {/* ── Sidebar ── */}
        {/* <aside className={`shrink-0 flex flex-col bg-white dark:bg-[#0C1326] border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 z-20 absolute md:relative h-full ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-18'}`}> */}
        <aside className={`shrink-0 flex flex-col bg-white dark:bg-[#0C1326] border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 z-50 fixed md:fixed inset-y-0 left-0 h-full ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-18'}`}>
          {/* Logo */}
          <div className="px-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 min-h-16 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-sm font-bold font-mono tracking-tight">Px</span>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">PlexusOS</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Neurology Practice</div>
              </div>
            )}

            {/* Mobile close button inside sidebar */}
            <button className="md:hidden ml-auto p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md"
              onClick={() => setSidebarOpen(false)}>
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Site selector */}
          {sidebarOpen && (
            <div className="p-3 pb-1.5 transition-all duration-300">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">Site Filter</label>
              <select
                className="w-full text-xs font-semibold px-2 py-2 rounded-lg bg-slate-50 dark:bg-[#1E293B]/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/50 transition-shadow appearance-none"
                value={selectedSite}
                onChange={e => setSelectedSite(e.target.value)}
              >
                {mockData.sites.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-2 py-3 flex flex-col gap-1 overflow-y-auto">
            {modules.map(m => (
              <button key={m.id} onClick={() => { setActiveModule(m.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-[13px] font-bold cursor-pointer transition-all ${activeModule === m.id
                    ? "bg-blue-50 dark:bg-blue-600/15 border-blue-200 dark:border-blue-600/30 text-blue-700 dark:text-blue-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E293B]/40 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                title={!sidebarOpen ? m.label : undefined}
              >
                <span className="shrink-0 flex items-center justify-center p-0.5">{m.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{m.label}</span>
                    {m.badge && <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500 shrink-0 shadow-sm">{m.badge}</span>}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Pilot badge */}
          {sidebarOpen && (
            <div className="mx-3 mb-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 transition-all duration-300">
              <div className="text-[13px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="text-sm">🚀</span> Pilot v0.1
              </div>
              <div className="text-[11px] text-blue-500/80 dark:text-blue-300/60 mt-0.5 font-medium">Sprint 3 · Week 7 of 9</div>
              <div className="mt-2.5 h-1.5 rounded-full bg-blue-200 dark:bg-blue-900/40 overflow-hidden w-full">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "77%" }} />
              </div>
            </div>
          )}

          {/* Collapse */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center p-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B]/20 border-t border-slate-200 dark:border-slate-800 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </aside>

        {/* ── Main ── */}
        {/* <div className="flex-1 flex flex-col h-dvh overflow-hidden relative w-full"> */}
        <div className={`flex-1 flex flex-col h-dvh overflow-hidden relative w-full transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-18'}`}>
          {/* Topbar */}
          <header className="flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0C1326]/80 backdrop-blur-md min-h-16 shrink-0 shadow-sm z-10 w-full gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                onClick={() => setSidebarOpen(true)}
              >
                <ChevronRight size={20} />
              </button>
              <div className="overflow-hidden">
                <h1 className="m-0 text-[15px] sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight truncate">{moduleTitle[activeModule]}</h1>
                <p className="m-0 text-[11px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedSite}</span> · Dr. Shahid Rafiq Practice · Feb 27, 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/40 border border-slate-200 dark:border-slate-700 transition-colors group focus-within:ring-2 focus-within:ring-blue-500/50">
                <Search size={14} className="text-slate-400" />
                <span className="text-[13px] font-medium text-slate-400 group-focus-within:hidden">Search...</span>
                <input className="hidden group-focus-within:block bg-transparent border-none outline-none text-[13px] text-slate-800 dark:text-slate-200 w-24 sm:w-32" placeholder="Search..." autoFocus />
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 group-focus-within:hidden">⌘K</span>
              </div>

              {/* Mobile Search Icon Only */}
              <button className="sm:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Search size={18} />
              </button>

              <ThemeToggle />

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${notifOpen
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      : 'bg-slate-50 dark:bg-[#1E293B]/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1E293B]/60'
                    }`}
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0C1326]" />
                </button>

                {/* Notification dropdown */}
                {notifOpen && (
                  <>
                    {/* <div className="fixed inset-0 z-40 md:hidden bg-slate-900/20 backdrop-blur-sm" onClick={() => setNotifOpen(false)} /> */}
                    <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl overflow-hidden bg-white dark:bg-[#0E1529] border border-slate-200 dark:border-slate-800 shadow-xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white">Notifications</span>
                        <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                      </div>
                      <div className="p-2 max-h-90 overflow-y-auto">
                        {mockData.alerts.map(a => <AlertItem key={a.id} alert={a} />)}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Export */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1E293B]/60 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border-none cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm">
                <LogOut size={14} className="-rotate-90" /> Export
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[13px] font-bold text-white shadow-sm shrink-0 cursor-pointer border-2 border-white dark:border-slate-800 ring-2 ring-transparent hover:ring-blue-500/30 transition-shadow">
                MG
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full relative">
            <div className="max-w-400 mx-auto w-full">
              {activeModule === "dashboard" && <ExecutiveDashboard />}
              {activeModule === "financial" && <FinancialModule />}
              {activeModule === "hr" && <HRModule />}
              {activeModule === "contracts" && <ContractsModule />}
              {activeModule === "settings" && <SettingsModule />}
            </div>
            {/* Scroll bottom padding for mobile */}
            <div className="h-6 w-full" />
          </main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
