import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../App';
import { MiniBarChart, DonutChart, ProgressBar } from '../components/Shared';
import { mockData } from '../mockData';
import { DollarSign, LineChart, TrendingDown, Clock, FolderDown, AlertTriangle, BarChart2, TrendingUp, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/* ─── Formatters ──────────────────────────────────────────────────────── */
const fmtK = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;
const fmtCurrency = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/* ─── Global Styles ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .fin-module * { font-family: 'Outfit', sans-serif; }
        .fin-mono { font-family: 'JetBrains Mono', monospace !important; }

        /* Glass card base */
        .fin-glass {
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .fin-glass:hover {
            box-shadow: 0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.10);
            border-color: rgba(255,255,255,0.13);
        }

        /* Stat card per-color glows */
        .fin-stat-green:hover  { box-shadow: 0 0 0 1px rgba(16,185,129,0.35),  0 12px 40px rgba(16,185,129,0.18); }
        .fin-stat-blue:hover   { box-shadow: 0 0 0 1px rgba(59,130,246,0.35),  0 12px 40px rgba(59,130,246,0.18); }
        .fin-stat-amber:hover  { box-shadow: 0 0 0 1px rgba(245,158,11,0.35),  0 12px 40px rgba(245,158,11,0.18); }
        .fin-stat-cyan:hover   { box-shadow: 0 0 0 1px rgba(6,182,212,0.35),   0 12px 40px rgba(6,182,212,0.18); }
        .fin-stat-purple:hover { box-shadow: 0 0 0 1px rgba(168,85,247,0.35),  0 12px 40px rgba(168,85,247,0.18); }
        .fin-stat-red:hover    { box-shadow: 0 0 0 1px rgba(239,68,68,0.35),   0 12px 40px rgba(239,68,68,0.18); }

        /* Entrance animation */
        @keyframes finFadeIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .fin-enter { animation: finFadeIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }

        .fin-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .fin-stagger > *:nth-child(2) { animation-delay: 55ms; }
        .fin-stagger > *:nth-child(3) { animation-delay: 110ms; }
        .fin-stagger > *:nth-child(4) { animation-delay: 165ms; }

        /* Tab bar */
        .fin-tab-active {
            background: linear-gradient(135deg, rgba(59,130,246,0.90) 0%, rgba(99,102,241,0.90) 100%);
            box-shadow: 0 0 22px rgba(59,130,246,0.48), 0 4px 14px rgba(99,102,241,0.30);
        }

        /* Section title bar */
        .fin-section-title {
            display: flex; align-items: center; gap: 10px;
        }
        .fin-section-title::before {
            content: ''; display: block; width: 4px; height: 18px; border-radius: 2px;
            background: linear-gradient(180deg,#3b82f6,#6366f1); flex-shrink: 0;
        }

        /* Import banner */
        .fin-import-banner {
            background: rgba(59,130,246,0.09);
            border: 1px solid rgba(59,130,246,0.22);
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(59,130,246,0.10), inset 0 1px 0 rgba(255,255,255,0.04);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .fin-import-banner:hover {
            border-color: rgba(59,130,246,0.38);
            box-shadow: 0 6px 28px rgba(59,130,246,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* Import button */
        .fin-import-btn {
            background: linear-gradient(135deg, #3b82f6, #6366f1);
            box-shadow: 0 4px 14px rgba(59,130,246,0.42);
            transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .fin-import-btn:hover {
            opacity: 0.90; transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(59,130,246,0.55);
        }
        .fin-import-btn:active { transform: translateY(0); }

        /* Row hover */
        .fin-row { transition: background 0.18s ease, transform 0.18s ease; }
        .fin-row:hover { transform: translateX(2px); }

        /* Provider bar card */
        .fin-provider-card {
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fin-provider-card:hover {
            border-color: rgba(59,130,246,0.35) !important;
            box-shadow: 0 4px 18px rgba(59,130,246,0.12);
            transform: translateX(3px);
        }

        /* Expense category card */
        .fin-exp-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }
        .fin-exp-card:hover {
            border-color: rgba(99,102,241,0.40) !important;
            box-shadow: 0 6px 22px rgba(99,102,241,0.14);
            transform: translateY(-2px);
        }

        /* AR aging row */
        .fin-ar-row {
            transition: background 0.18s ease, border-color 0.18s ease;
        }
        .fin-ar-row:hover { background: rgba(255,255,255,0.04) !important; }

        /* Projection card */
        .fin-proj-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.3s ease;
        }
        .fin-proj-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(16,185,129,0.18), 0 0 0 1px rgba(16,185,129,0.28) !important;
            border-color: rgba(16,185,129,0.30) !important;
        }

        /* Benchmark card */
        .fin-bench-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }
        .fin-bench-card:hover {
            border-color: rgba(245,158,11,0.40) !important;
            box-shadow: 0 6px 22px rgba(245,158,11,0.13);
            transform: translateY(-2px);
        }

        /* Donut legend row */
        .fin-legend-row { transition: opacity 0.2s ease; }
        .fin-legend-row:hover { opacity: 0.85; }

        /* Progress bar glow */
        .fin-progress-glow { box-shadow: 0 0 10px rgba(59,130,246,0.50); }

        /* Amber alert banner */
        .fin-alert-amber {
            border-left: 3px solid rgba(245,158,11,0.80);
            background: rgba(245,158,11,0.08);
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(245,158,11,0.10), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* Cash flow summary row */
        .fin-cf-row { transition: background 0.15s ease; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .fin-cf-row:hover { background: rgba(255,255,255,0.03); }

        /* Scrollbar */
        .fin-scroll::-webkit-scrollbar { width: 4px; }
        .fin-scroll::-webkit-scrollbar-track { background: transparent; }
        .fin-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.35); border-radius: 99px; }
    `}</style>
);

/* ─── Badge ───────────────────────────────────────────────────────────── */
const colorMap = {
    green:  { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.30)' },
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.30)' },
    cyan:   { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee', border: 'rgba(6,182,212,0.30)' },
    amber:  { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.30)' },
    purple: { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.30)' },
    red:    { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.30)' },
    gray:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
};
const Badge = ({ color = 'gray', children }) => {
    const c = colorMap[color] || colorMap.gray;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
            whiteSpace: 'nowrap', background: c.bg, color: c.text, border: `1px solid ${c.border}`,
            transition: 'filter 0.2s, transform 0.2s',
        }}>
            {children}
        </span>
    );
};

/* ─── Icon colours ────────────────────────────────────────────────────── */
const iconBg = {
    green:  { bg: 'rgba(16,185,129,0.18)',  color: '#34d399' },
    blue:   { bg: 'rgba(59,130,246,0.18)',  color: '#60a5fa' },
    cyan:   { bg: 'rgba(6,182,212,0.18)',   color: '#22d3ee' },
    amber:  { bg: 'rgba(245,158,11,0.18)',  color: '#fbbf24' },
    purple: { bg: 'rgba(168,85,247,0.18)',  color: '#c084fc' },
    red:    { bg: 'rgba(239,68,68,0.18)',   color: '#f87171' },
};

/* ─── StatCard ────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, color = 'blue', trend }) => {
    const ic = iconBg[color] || iconBg.blue;
    const trendPos = trend > 0;
    return (
        <div className={`fin-glass fin-stat-${color} fin-enter rounded-2xl p-5 flex flex-col gap-4 cursor-default`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ic.bg, color: ic.color, flexShrink: 0,
                }}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
                        color: trendPos ? '#34d399' : '#f87171',
                        background: trendPos ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        padding: '3px 8px', borderRadius: 999,
                        border: `1px solid ${trendPos ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}>
                        {trendPos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <div className="fin-mono" style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(148,163,184,0.65)', marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.50)', marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
};

/* ─── TabBar ──────────────────────────────────────────────────────────── */
const TabBar = ({ tabs, active, onChange }) => (
    <div style={{
        display: 'flex', gap: 4, padding: '5px', borderRadius: 16,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)', flexWrap: 'wrap',
    }}>
        {tabs.map(t => (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
                flex: '1 1 auto', padding: '8px 18px', borderRadius: 11, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                ...(active === t.id
                    ? { color: '#fff', background: 'linear-gradient(135deg,rgba(59,130,246,0.90),rgba(99,102,241,0.90))', boxShadow: '0 0 20px rgba(59,130,246,0.45),0 4px 12px rgba(99,102,241,0.28)' }
                    : { color: 'rgba(148,163,184,0.75)', background: 'transparent' }),
            }}>{t.label}</button>
        ))}
    </div>
);

/* ─── SectionHeader ───────────────────────────────────────────────────── */
const SectionHeader = ({ title, right }) => (
    <div className="fin-section-title" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{title}</span>
        {right && <div>{right}</div>}
    </div>
);

/* ─── Import Banner ───────────────────────────────────────────────────── */
const ImportBanner = () => (
    <div className="fin-import-banner fin-enter rounded-2xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(59,130,246,0.18)', color: '#60a5fa', flexShrink: 0,
            }}>
                <FolderDown size={20} strokeWidth={1.5} />
            </div>
            <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd', marginBottom: 2 }}>Data Import Engine Active</div>
                <div style={{ fontSize: 12, color: 'rgba(147,197,253,0.60)' }}>Upload CSV, Excel, or PDF billing reports — inbox watching active.</div>
            </div>
        </div>
        <button className="fin-import-btn" style={{ padding: '8px 20px', borderRadius: 10, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' }}>
            Import Data
        </button>
    </div>
);

/* ─── Alert Banner ────────────────────────────────────────────────────── */
const AlertBanner = ({ icon, title, desc }) => (
    <div className="fin-alert-amber fin-enter rounded-2xl p-4" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
        <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fcd34d', marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'rgba(252,211,77,0.65)', lineHeight: 1.5 }}>{desc}</div>
        </div>
    </div>
);

/* ─── FinancialModule ─────────────────────────────────────────────────── */
export function FinancialModule() {
    const { dark } = useTheme();
    const [tab, setTab] = useState("cash");

    const tabs = [
        { id: "cash",        label: "Cash Position"     },
        { id: "revenue",     label: "Revenue Analytics" },
        { id: "expenses",    label: "Expenses"          },
        { id: "ar",          label: "AR Aging"          },
        { id: "projections", label: "Projections"       },
    ];

    return (
        <div className="fin-module" style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <GlobalStyles />
            <TabBar tabs={tabs} active={tab} onChange={setTab} />
            <ImportBanner />

            {/* ── Cash Position ── */}
            {tab === "cash" && (
                <div key="cash" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fin-enter">
                    <div className="fin-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Cash Position"       value={fmtK(mockData.cashPosition.total)}   sub="All bank accounts"   icon={<DollarSign size={20}/>}    color="green"  trend={6.2}  />
                        <StatCard label="Accounts Receivable" value={fmtK(mockData.cashPosition.ar)}      sub="Outstanding billings" icon={<LineChart size={20}/>}     color="blue"   trend={-2.1} />
                        <StatCard label="Accounts Payable"    value={fmtK(mockData.cashPosition.ap)}      sub="Due obligations"     icon={<TrendingDown size={20}/>}   color="amber"  trend={1.4}  />
                        <StatCard label="Cash Runway"         value={`${mockData.cashPosition.runway} days`} sub="At current burn rate" icon={<Clock size={20}/>}      color="cyan"              />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
                        {/* Cash Position Trend */}
                        <div className="fin-glass fin-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <SectionHeader title="Cash Position Trend (8 Months)" />
                            <div style={{ width: '100%', height: 96, marginBottom: 4 }}>
                                <MiniBarChart data={mockData.cashPosition.trend} height={96} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                {["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"].map(m => (
                                    <span key={m} className="fin-mono" style={{ fontSize: 10, fontWeight: 500, color: 'rgba(148,163,184,0.45)', textAlign: 'center', flex: 1 }}>{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Cash Flow Summary */}
                        <div className="fin-glass fin-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column' }}>
                            <SectionHeader title="Cash Flow Summary — Feb 2026" />
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                                {[
                                    { label: "Total Revenue",  value: fmtCurrency(445500), color: '#34d399' },
                                    { label: "Total Expenses", value: fmtCurrency(295000), color: '#f87171' },
                                ].map(row => (
                                    <div key={row.label} className="fin-cf-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(148,163,184,0.75)' }}>{row.label}</span>
                                        <span className="fin-mono" style={{ fontSize: 15, fontWeight: 700, color: row.color, letterSpacing: '-0.02em' }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginTop: 4 }}>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9' }}>Net Income</span>
                                    <span className="fin-mono" style={{
                                        fontSize: 22, fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em',
                                        textShadow: '0 0 20px rgba(52,211,153,0.35)',
                                    }}>{fmtCurrency(150500)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Revenue Analytics ── */}
            {tab === "revenue" && (
                <div key="revenue" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fin-enter">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
                        {/* Revenue by Payor */}
                        <div className="fin-glass fin-enter rounded-2xl p-6">
                            <SectionHeader title="Revenue by Payor" />
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, justifyContent: 'center' }}>
                                <div style={{ flexShrink: 0 }}>
                                    <DonutChart segments={mockData.revenueByPayor} size={150} />
                                </div>
                                <div style={{ flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {mockData.revenueByPayor.map(p => (
                                        <div key={p.name} className="fin-legend-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'default' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    backgroundColor: p.color,
                                                    boxShadow: `0 0 8px ${p.color}80`,
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{p.name}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div className="fin-mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{p.value}%</div>
                                                <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.50)' }}>{fmtK(p.amount)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Revenue by Provider */}
                        <div className="fin-glass fin-enter rounded-2xl p-6" style={{ maxHeight: 400 }}>
                            <SectionHeader title="Revenue by Provider" />
                            <div className="fin-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 310 }}>
                                {mockData.revenueByProvider.map(p => (
                                    <div key={p.name} className="fin-provider-card" style={{
                                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{p.name}</span>
                                            <span className="fin-mono" style={{ fontSize: 14, fontWeight: 700, color: '#34d399', letterSpacing: '-0.01em' }}>{fmtK(p.revenue)}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                            {[`wRVU: ${p.rvu.toLocaleString()}`, `Exp: ${fmtK(p.expenses)}`].map(tag => (
                                                <span key={tag} style={{
                                                    fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.55)',
                                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                                    padding: '2px 8px', borderRadius: 6,
                                                }}>{tag}</span>
                                            ))}
                                        </div>
                                        <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: 999,
                                                width: `${(p.revenue / 124500) * 100}%`,
                                                background: 'linear-gradient(90deg,#3b82f6,#6366f1)',
                                                boxShadow: '0 0 8px rgba(59,130,246,0.50)',
                                                transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Revenue by Site */}
                    <div className="fin-glass fin-enter rounded-2xl p-6">
                        <SectionHeader title="Revenue by Site — Feb 2026" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '8px 32px' }}>
                            {mockData.revenueBySite.map(s => (
                                <ProgressBar key={s.site} label={s.site} sublabel={fmtK(s.revenue)} value={s.revenue} max={248000} color="#3B82F6" />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Expenses ── */}
            {tab === "expenses" && (
                <div key="expenses" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fin-enter">
                    <div className="fin-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Total Expenses"  value={fmtK(mockData.expenses.payroll + mockData.expenses.nonPayroll)} sub="February 2026"    icon={<TrendingDown size={20}/>} color="red"    />
                        <StatCard label="Payroll"         value={fmtK(mockData.expenses.payroll)}                                sub="66% of total"     icon={<LineChart size={20}/>}   color="purple" />
                        <StatCard label="Non-Payroll"     value={fmtK(mockData.expenses.nonPayroll)}                            sub="Operational costs" icon={<BarChart2 size={20}/>}   color="amber"  />
                    </div>

                    <div className="fin-glass fin-enter rounded-2xl p-6">
                        <SectionHeader title="Expense Breakdown by Category" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
                            {mockData.expenses.categories.map((c, idx) => (
                                <div key={c.name} className="fin-exp-card" style={{
                                    padding: '16px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    animationDelay: `${idx * 50}ms`,
                                }}>
                                    <div className="fin-mono" style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 4 }}>{fmtK(c.amount)}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(148,163,184,0.60)', marginBottom: 12 }}>{c.name}</div>
                                    <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 999,
                                            width: `${(c.amount / 380000) * 100}%`,
                                            background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                                            boxShadow: '0 0 8px rgba(99,102,241,0.45)',
                                            transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── AR Aging ── */}
            {tab === "ar" && (
                <div key="ar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fin-enter">
                    <div className="fin-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Total AR"        value={fmtK(mockData.cashPosition.ar)} sub="Gross outstanding" icon={<LineChart size={20}/>}     color="blue"  />
                        <StatCard label="AR Days"         value="38.2"                           sub="Target: <35 days"  icon={<Clock size={20}/>}          color="amber" />
                        <StatCard label="Collection Rate" value="94.2%"                          sub="Target: >95%"      icon={<AlertTriangle size={20}/>}  color="green" />
                        <StatCard label="Denial Rate"     value="4.8%"                           sub="Target: <5%"       icon={<TrendingDown size={20}/>}   color="red"   />
                    </div>

                    <div className="fin-glass fin-enter rounded-2xl p-6">
                        <SectionHeader title="AR Aging Buckets" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {mockData.arAging.map(b => (
                                <div key={b.bucket} className="fin-ar-row" style={{ padding: '10px 12px', borderRadius: 12, cursor: 'default' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{b.bucket}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.55)', minWidth: 32, textAlign: 'right' }}>{b.pct}%</span>
                                            <span className="fin-mono" style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', minWidth: 70, textAlign: 'right', letterSpacing: '-0.01em' }}>{fmtK(b.amount)}</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 999,
                                            width: `${b.pct}%`,
                                            backgroundColor: b.color,
                                            boxShadow: `0 0 10px ${b.color}80`,
                                            transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <AlertBanner
                                icon={<AlertTriangle size={22} color="#fbbf24" strokeWidth={1.5}/>}
                                title="AR days at 38.2 — above 35-day target"
                                desc={`${fmtK(mockData.arAging[3].amount + mockData.arAging[4].amount)} in 91+ days bucket requires active escalation with payors.`}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Projections ── */}
            {tab === "projections" && (
                <div key="projections" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fin-enter">
                    <div className="fin-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                        {[
                            { label: "30-Day Forecast", value: fmtK(1380000), trend: "+7.4%"  },
                            { label: "60-Day Forecast", value: fmtK(1510000), trend: "+17.5%" },
                            { label: "90-Day Forecast", value: fmtK(1640000), trend: "+27.6%" },
                        ].map(f => (
                            <div key={f.label} className="fin-glass fin-proj-card fin-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, cursor: 'default' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(148,163,184,0.55)' }}>{f.label}</div>
                                <div className="fin-mono" style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', lineHeight: 1 }}>{f.value}</div>
                                <span style={{
                                    fontSize: 13, fontWeight: 700, color: '#34d399',
                                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                                    padding: '4px 12px', borderRadius: 999,
                                }}>{f.trend} vs today</span>
                                <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.40)', lineHeight: 1.5, marginTop: 4 }}>Based on historical run-rate + contracted revenue</p>
                            </div>
                        ))}
                    </div>

                    <div className="fin-glass fin-enter rounded-2xl p-6">
                        <SectionHeader title="MGMA Neurology Benchmarks" right={<Badge color="cyan">2025 Data</Badge>} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
                            {[
                                { metric: "AR Days",         yours: "38.2",  benchmark: "< 35"   },
                                { metric: "Collection Rate", yours: "94.2%", benchmark: "> 95%"  },
                                { metric: "Overhead %",      yours: "61.8%", benchmark: "< 60%"  },
                                { metric: "wRVU/Provider",   yours: "1,605", benchmark: "1,800+" },
                            ].map((b, idx) => (
                                <div key={b.metric} className="fin-bench-card fin-enter" style={{
                                    padding: '16px', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    animationDelay: `${idx * 60}ms`,
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(148,163,184,0.55)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{b.metric}</div>
                                    <div className="fin-mono" style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 12 }}>{b.yours}</div>
                                    <div style={{
                                        paddingTop: 12,
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                                    }}>
                                        <span style={{ color: 'rgba(148,163,184,0.45)' }}>Benchmark:</span>
                                        <span style={{ fontWeight: 700, color: '#fbbf24' }}>{b.benchmark}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}