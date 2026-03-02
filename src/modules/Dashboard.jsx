import React from 'react';
import { useTheme } from '../App';
import { PracticeScoreGauge, AlertItem } from '../components/Shared';
import { mockData } from '../mockData';
import { DollarSign, BarChart2, Users, FileText, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

/* ─── Formatters ──────────────────────────────────────────────────────── */
const fmtK = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

/* ─── Global Styles ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .dash-module * { font-family: 'Outfit', sans-serif; }
        .dash-mono { font-family: 'JetBrains Mono', monospace !important; }

        /* ── Glass card ── */
        .dash-glass {
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .dash-glass:hover {
            box-shadow: 0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.10);
            border-color: rgba(255,255,255,0.13);
        }

        /* ── Per-color stat glow ── */
        .dash-stat-green:hover  { box-shadow: 0 0 0 1px rgba(16,185,129,0.35),  0 12px 40px rgba(16,185,129,0.18); }
        .dash-stat-blue:hover   { box-shadow: 0 0 0 1px rgba(59,130,246,0.35),  0 12px 40px rgba(59,130,246,0.18); }
        .dash-stat-purple:hover { box-shadow: 0 0 0 1px rgba(168,85,247,0.35),  0 12px 40px rgba(168,85,247,0.18); }
        .dash-stat-cyan:hover   { box-shadow: 0 0 0 1px rgba(6,182,212,0.35),   0 12px 40px rgba(6,182,212,0.18); }

        /* ── Entrance animations ── */
        @keyframes dashFadeIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .dash-enter { animation: dashFadeIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }

        .dash-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .dash-stagger > *:nth-child(2) { animation-delay: 60ms; }
        .dash-stagger > *:nth-child(3) { animation-delay: 120ms; }
        .dash-stagger > *:nth-child(4) { animation-delay: 180ms; }

        /* ── Section title with left accent bar ── */
        .dash-section-title {
            display: flex; align-items: center; gap: 10px;
        }
        .dash-section-title::before {
            content: ''; display: block; width: 4px; height: 18px; border-radius: 2px;
            background: linear-gradient(180deg,#6366f1,#3b82f6); flex-shrink: 0;
        }

        /* ── Bar chart column ── */
        .dash-bar-col {
            transition: filter 0.2s ease, transform 0.2s ease;
        }
        .dash-bar-col:hover { filter: brightness(1.18); transform: scaleY(1.02); transform-origin: bottom; }

        /* ── Tooltip ── */
        .dash-tooltip {
            opacity: 0; pointer-events: none;
            transition: opacity 0.18s ease;
            position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
            background: rgba(15,23,42,0.95);
            border: 1px solid rgba(255,255,255,0.10);
            backdrop-filter: blur(10px);
            color: #f1f5f9; font-size: 11px; font-weight: 600;
            padding: 5px 10px; border-radius: 8px; white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            z-index: 20;
        }
        .dash-bar-group:hover .dash-tooltip { opacity: 1; }

        /* ── Progress bars ── */
        .dash-prog-bar {
            height: 6px; border-radius: 999px; overflow: hidden;
            background: rgba(255,255,255,0.06);
        }
        .dash-prog-fill {
            height: 100%; border-radius: 999px;
            transition: width 0.9s cubic-bezier(0.22,1,0.36,1);
        }

        /* ── Action item row ── */
        .dash-action-row {
            transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .dash-action-row:hover {
            background: rgba(99,102,241,0.08) !important;
            border-color: rgba(99,102,241,0.25) !important;
            transform: translateX(2px);
        }

        /* ── Alert row ── */
        .dash-alert-row {
            transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .dash-alert-row:hover { transform: translateX(2px); }

        /* ── View button ── */
        .dash-view-btn {
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.05);
            color: #94a3b8;
        }
        .dash-view-btn:hover {
            background: rgba(99,102,241,0.18);
            border-color: rgba(99,102,241,0.40);
            color: #a5b4fc;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99,102,241,0.22);
        }

        /* ── Site performance card ── */
        .dash-site-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .dash-site-card:hover {
            border-color: rgba(16,185,129,0.35) !important;
            box-shadow: 0 8px 28px rgba(16,185,129,0.14);
            transform: translateY(-3px);
        }

        /* ── Score metric row ── */
        .dash-score-row { transition: opacity 0.2s ease; }
        .dash-score-row:hover { opacity: 0.85; }

        /* ── Scrollbar ── */
        .dash-scroll::-webkit-scrollbar { width: 4px; }
        .dash-scroll::-webkit-scrollbar-track { background: transparent; }
        .dash-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 99px; }
    `}</style>
);

/* ─── Badge ───────────────────────────────────────────────────────────── */
const colorMap = {
    green:  { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.28)' },
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.28)' },
    cyan:   { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee', border: 'rgba(6,182,212,0.28)' },
    amber:  { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.28)' },
    purple: { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.28)' },
    red:    { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.28)' },
    gray:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)' },
};
const Badge = ({ color = 'gray', children }) => {
    const c = colorMap[color] || colorMap.gray;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
            whiteSpace: 'nowrap', background: c.bg, color: c.text, border: `1px solid ${c.border}`,
        }}>{children}</span>
    );
};

/* ─── Icon background map ─────────────────────────────────────────────── */
const iconBg = {
    green:  { bg: 'rgba(16,185,129,0.18)',  color: '#34d399' },
    blue:   { bg: 'rgba(59,130,246,0.18)',  color: '#60a5fa' },
    purple: { bg: 'rgba(168,85,247,0.18)',  color: '#c084fc' },
    cyan:   { bg: 'rgba(6,182,212,0.18)',   color: '#22d3ee' },
};

/* ─── StatCard ────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, color = 'blue', trend }) => {
    const ic = iconBg[color] || iconBg.blue;
    const trendPos = trend > 0;
    return (
        <div className={`dash-glass dash-stat-${color} dash-enter rounded-2xl p-5 flex flex-col gap-4 cursor-default`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ic.bg, color: ic.color, flexShrink: 0,
                }}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700,
                        color: trendPos ? '#34d399' : '#f87171',
                        background: trendPos ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        padding: '3px 8px', borderRadius: 999,
                        border: `1px solid ${trendPos ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    }}>
                        {trendPos ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                        {Math.abs(trend)}%
                    </div>
                )}
                {trend === undefined && (
                    <ChevronRight size={14} style={{ color: 'rgba(148,163,184,0.30)', marginTop: 2 }} />
                )}
            </div>
            <div>
                <div className="dash-mono" style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(148,163,184,0.60)', marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.45)', marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
};

/* ─── SectionHeader ───────────────────────────────────────────────────── */
const SectionHeader = ({ title, right }) => (
    <div className="dash-section-title" style={{ marginBottom: 16, justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{title}</span>
        {right && <div>{right}</div>}
    </div>
);

/* ─── Score metric bar ────────────────────────────────────────────────── */
const scoreColors = {
    emerald: { fill: '#10b981', glow: 'rgba(16,185,129,0.45)', text: '#34d399' },
    amber:   { fill: '#f59e0b', glow: 'rgba(245,158,11,0.45)',  text: '#fbbf24' },
    blue:    { fill: '#3b82f6', glow: 'rgba(59,130,246,0.45)',  text: '#60a5fa' },
};
const ScoreBar = ({ label, val, colorKey }) => {
    const c = scoreColors[colorKey];
    return (
        <div className="dash-score-row" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>
                <span style={{ color: 'rgba(148,163,184,0.70)' }}>{label}</span>
                <span className="dash-mono" style={{ fontWeight: 700, color: c.text }}>{val}/100</span>
            </div>
            <div className="dash-prog-bar">
                <div className="dash-prog-fill" style={{ width: `${val}%`, background: c.fill, boxShadow: `0 0 10px ${c.glow}` }} />
            </div>
        </div>
    );
};

/* ─── ExecutiveDashboard ──────────────────────────────────────────────── */
export function ExecutiveDashboard() {
    const { dark } = useTheme();

    return (
        <div className="dash-module" style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <GlobalStyles />

            {/* ── Top Stats ── */}
            <div className="dash-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                <StatCard label="Cash Position"    value={fmtK(mockData.cashPosition.total)} sub="Across all sites"         icon={<DollarSign size={20}/>} trend={6.2}  color="green"  />
                <StatCard label="Total AR"          value={fmtK(mockData.cashPosition.ar)}    sub="Outstanding receivables"  icon={<BarChart2 size={20}/>}  trend={-2.1} color="blue"   />
                <StatCard label="Active Staff"      value="23"                                sub="Across 4 locations"       icon={<Users size={20}/>}      trend={8.3}  color="purple" />
                <StatCard label="Active Contracts"  value="8"                                 sub="3 requiring attention"    icon={<FileText size={20}/>}               color="cyan"   />
            </div>

            {/* ── Practice Overview + Revenue Chart ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>

                {/* Practice Overview */}
                <div className="dash-glass dash-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <SectionHeader title="Practice Overview" />
                    <PracticeScoreGauge score={mockData.practiceScore} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                        <ScoreBar label="Financial Health" val={82} colorKey="emerald" />
                        <ScoreBar label="HR Compliance"    val={61} colorKey="amber"   />
                        <ScoreBar label="Contract Status"  val={79} colorKey="blue"    />
                    </div>
                </div>

                {/* Revenue vs Expenses Chart */}
                <div className="dash-glass dash-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                    <SectionHeader title="Revenue vs Expenses — Last 7 Months" right={<Badge color="blue">Monthly</Badge>} />

                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 192, width: '100%', marginTop: 8 }}>
                        {mockData.monthlyRevenue.map((d, i) => {
                            const max = 467000;
                            return (
                                <div key={i} className="dash-bar-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', position: 'relative' }}>
                                    <div className="dash-tooltip">
                                        Rev: {fmtK(d.revenue)} | Exp: {fmtK(d.expenses)}
                                    </div>
                                    <div className="dash-bar-col" style={{
                                        width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                        gap: 1, borderRadius: '6px 6px 0 0', overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.04)', cursor: 'default',
                                    }}>
                                        {/* Expenses bar */}
                                        <div style={{
                                            width: '100%',
                                            height: `${(d.expenses / max) * 100}%`,
                                            background: 'linear-gradient(180deg, rgba(239,68,68,0.85), rgba(220,38,38,0.70))',
                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                                            transition: 'height 0.7s cubic-bezier(0.22,1,0.36,1)',
                                        }} />
                                        {/* Net margin bar */}
                                        <div style={{
                                            width: '100%',
                                            height: `${((d.revenue - d.expenses) / max) * 100}%`,
                                            background: 'linear-gradient(180deg, rgba(16,185,129,0.90), rgba(5,150,105,0.75))',
                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 0 10px rgba(16,185,129,0.20)',
                                            borderRadius: '3px 3px 0 0',
                                            transition: 'height 0.7s cubic-bezier(0.22,1,0.36,1)',
                                        }} />
                                    </div>
                                    <span className="dash-mono" style={{ fontSize: 10, color: 'rgba(148,163,184,0.45)', fontWeight: 500 }}>{d.month}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                        {[
                            { label: 'Net Margin', color: 'rgba(16,185,129,0.85)', glow: 'rgba(16,185,129,0.35)' },
                            { label: 'Expenses',   color: 'rgba(239,68,68,0.85)',  glow: 'rgba(239,68,68,0.35)'  },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: 3,
                                    background: l.color, boxShadow: `0 0 6px ${l.glow}`,
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.60)' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Active Alerts + Action Items ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>

                {/* Active Alerts */}
                <div className="dash-glass dash-enter rounded-2xl p-6">
                    <SectionHeader title="Active Alerts" right={<Badge color="red">2 Critical</Badge>} />
                    <div className="dash-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', maxHeight: 250 }}>
                        {mockData.alerts.map(a => (
                            <div key={a.id} className="dash-alert-row" style={{ borderRadius: 12 }}>
                                <AlertItem alert={a} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Items */}
                <div className="dash-glass dash-enter rounded-2xl p-6">
                    <SectionHeader title="Action Items" />
                    <div className="dash-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 250 }}>
                        {[
                            { priority: "high",   title: "Renew Dr. Chen board certification",    due: "Overdue", module: "HR"         },
                            { priority: "high",   title: "Review BlueCross contract renewal",       due: "47 days", module: "Contracts"  },
                            { priority: "medium", title: "Upload Feb billing — North Clinic",       due: "3 days",  module: "Financial"  },
                            { priority: "medium", title: "Dr. Patel DEA registration renewal",     due: "23 days", module: "HR"         },
                            { priority: "low",    title: "Schedule PA workflow review session",    due: "2 weeks", module: "Operations" },
                        ].map((item, i) => {
                            const dotColor = item.priority === "high" ? '#f87171' : item.priority === "medium" ? '#fbbf24' : '#60a5fa';
                            const dotGlow  = item.priority === "high" ? 'rgba(239,68,68,0.50)' : item.priority === "medium" ? 'rgba(245,158,11,0.50)' : 'rgba(59,130,246,0.50)';
                            const modColor = item.module === "HR" ? "purple" : item.module === "Financial" ? "blue" : item.module === "Contracts" ? "cyan" : "gray";
                            return (
                                <div key={i} className="dash-action-row" style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                        background: dotColor, boxShadow: `0 0 6px ${dotGlow}`,
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.title}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                            <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.50)', flexShrink: 0 }}>Due: {item.due}</span>
                                            <Badge color={modColor}>{item.module}</Badge>
                                        </div>
                                    </div>
                                    <button className="dash-view-btn" style={{
                                        fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 8,
                                        cursor: 'pointer', fontFamily: 'Outfit, sans-serif', flexShrink: 0,
                                    }}>View</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Site Performance Overview ── */}
            <div className="dash-glass dash-enter rounded-2xl p-6" style={{ marginBottom: 24 }}>
                <SectionHeader title="Site Performance Overview" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
                    {mockData.revenueBySite.map((s, idx) => {
                        const margin = ((s.revenue - s.expenses) / s.revenue) * 100;
                        return (
                            <div key={s.site} className="dash-site-card dash-enter" style={{
                                padding: '18px', borderRadius: 16, cursor: 'default',
                                background: 'rgba(255,255,255,0.03)',
                                animationDelay: `${idx * 60}ms`,
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(148,163,184,0.60)', marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {s.site}
                                </div>

                                <div style={{ marginBottom: 14 }}>
                                    <div className="dash-mono" style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>{fmtK(s.revenue)}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(148,163,184,0.40)', marginTop: 4 }}>Revenue</div>
                                </div>

                                <div style={{ marginBottom: 14 }}>
                                    <div className="dash-mono" style={{ fontSize: 15, fontWeight: 700, color: '#34d399', textShadow: '0 0 12px rgba(52,211,153,0.30)' }}>{fmtK(s.revenue - s.expenses)}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(148,163,184,0.40)', marginTop: 2 }}>Net Margin</div>
                                </div>

                                <div className="dash-prog-bar">
                                    <div className="dash-prog-fill" style={{
                                        width: `${margin}%`,
                                        background: 'linear-gradient(90deg,#10b981,#34d399)',
                                        boxShadow: '0 0 10px rgba(16,185,129,0.40)',
                                    }} />
                                </div>
                                <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.35)', marginTop: 6, textAlign: 'right' }}>{margin.toFixed(1)}%</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}