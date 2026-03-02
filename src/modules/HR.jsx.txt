import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../App';
import { mockData } from '../mockData';
import { Users, FileCheck, DollarSign, Calendar, GraduationCap, AlertCircle, Clock, ShieldAlert, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

/* ─── Utility ──────────────────────────────────────────────────────────── */
const fmtK = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

/* ─── Injected global styles (glassmorphism + custom animations) ────────── */
const GlobalStyles = ({ dark }) => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .hr-module * { font-family: 'Outfit', sans-serif; }
        .hr-mono { font-family: 'JetBrains Mono', monospace !important; }

        /* Glassmorphism card */
        .glass-card {
            background: ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'};
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
            box-shadow: ${dark 
                ? '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)'
                : '0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)'};
            transition: box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
        }
        .glass-card:hover {
            box-shadow: ${dark 
                ? '0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 16px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)'};
            border-color: ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)'};
        }

        /* Text colors based on theme */
        .hr-text-primary {
            color: ${dark ? '#f1f5f9' : '#0f172a'} !important;
        }
        .hr-text-secondary {
            color: ${dark ? 'rgba(148,163,184,0.75)' : 'rgba(51,65,85,0.75)'} !important;
        }
        .hr-text-tertiary {
            color: ${dark ? 'rgba(148,163,184,0.45)' : 'rgba(51,65,85,0.45)'} !important;
        }
        .hr-text-muted {
            color: ${dark ? 'rgba(148,163,184,0.35)' : 'rgba(51,65,85,0.35)'} !important;
        }

        /* Stat card glow on hover */
        .stat-card-purple:hover  { box-shadow: 0 0 0 1px rgba(168,85,247,0.35), 0 12px 40px rgba(168,85,247,0.18); }
        .stat-card-blue:hover    { box-shadow: 0 0 0 1px rgba(59,130,246,0.35), 0 12px 40px rgba(59,130,246,0.18); }
        .stat-card-cyan:hover    { box-shadow: 0 0 0 1px rgba(6,182,212,0.35),  0 12px 40px rgba(6,182,212,0.18); }
        .stat-card-amber:hover   { box-shadow: 0 0 0 1px rgba(245,158,11,0.35), 0 12px 40px rgba(245,158,11,0.18); }
        .stat-card-green:hover   { box-shadow: 0 0 0 1px rgba(16,185,129,0.35), 0 12px 40px rgba(16,185,129,0.18); }
        .stat-card-red:hover     { box-shadow: 0 0 0 1px rgba(239,68,68,0.35),  0 12px 40px rgba(239,68,68,0.18); }

        /* Tab active glow */
        .tab-active-glow {
            background: linear-gradient(135deg, rgba(168,85,247,0.90) 0%, rgba(99,102,241,0.90) 100%);
            box-shadow: 0 0 24px rgba(168,85,247,0.50), 0 4px 16px rgba(99,102,241,0.35);
        }

        /* Smooth fade-slide-in */
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .anim-enter { animation: fadeSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }

        /* Stagger children */
        .stagger > *:nth-child(1) { animation-delay: 0ms; }
        .stagger > *:nth-child(2) { animation-delay: 60ms; }
        .stagger > *:nth-child(3) { animation-delay: 120ms; }
        .stagger > *:nth-child(4) { animation-delay: 180ms; }
        .stagger > *:nth-child(5) { animation-delay: 240ms; }

        /* Progress bar shimmer */
        @keyframes shimmer {
            from { background-position: -200% center; }
            to   { background-position: 200% center; }
        }
        .progress-shine {
            background: linear-gradient(90deg, currentColor 0%, rgba(255,255,255,0.65) 50%, currentColor 100%);
            background-size: 200% auto;
            animation: shimmer 2.4s linear infinite;
        }

        /* Row hover */
        .hr-row {
            transition: background 0.18s ease, transform 0.18s ease;
        }
        .hr-row:hover { transform: translateX(2px); }

        /* Avatar ring pulse on hover */
        .avatar-wrap:hover .avatar-ring {
            box-shadow: 0 0 0 3px rgba(99,102,241,0.55);
        }
        .avatar-ring {
            transition: box-shadow 0.25s ease;
        }

        /* Badge transitions */
        .hr-badge {
            transition: filter 0.2s ease, transform 0.2s ease;
        }
        .hr-badge:hover { filter: brightness(1.15); transform: scale(1.05); }

        /* Manage button */
        .manage-btn {
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .manage-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99,102,241,0.28);
        }

        /* Calendar day */
        .cal-day {
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cal-day:hover { transform: scale(1.07); }
        .cal-day-pto:hover { box-shadow: 0 0 16px rgba(99,102,241,0.40); }

        /* Add Staff button */
        .add-btn {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 14px rgba(99,102,241,0.40);
        }
        .add-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(99,102,241,0.55);
        }
        .add-btn:active { transform: translateY(0); }

        /* Section heading line */
        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title::before {
            content: '';
            display: block;
            width: 4px;
            height: 18px;
            border-radius: 2px;
            background: linear-gradient(180deg,#8b5cf6,#6366f1);
            flex-shrink: 0;
        }

        /* Alert banner glow */
        .alert-banner-red {
            border-left: 3px solid rgba(239,68,68,0.8);
            background: ${dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.03)'};
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(239,68,68,0.12), inset 0 1px 0 ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'};
        }

        /* Training card */
        .training-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
            background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
            border: 1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'};
        }
        .training-card:hover {
            border-color: rgba(99,102,241,0.45) !important;
            box-shadow: 0 4px 20px rgba(99,102,241,0.12);
            transform: translateX(3px);
        }

        /* Scroll thin */
        .hr-scroll::-webkit-scrollbar { height: 4px; }
        .hr-scroll::-webkit-scrollbar-track { background: transparent; }
        .hr-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 99px; }
    `}</style>
);

/* ─── Badge ─────────────────────────────────────────────────────────────── */
const colorMap = {
    purple: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', border: 'rgba(168,85,247,0.30)' },
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#3b82f6', border: 'rgba(59,130,246,0.30)' },
    cyan:   { bg: 'rgba(6,182,212,0.15)',   text: '#06b6d4', border: 'rgba(6,182,212,0.30)' },
    green:  { bg: 'rgba(16,185,129,0.15)',  text: '#10b981', border: 'rgba(16,185,129,0.30)' },
    amber:  { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b', border: 'rgba(245,158,11,0.30)' },
    red:    { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444', border: 'rgba(239,68,68,0.30)' },
    gray:   { bg: 'rgba(148,163,184,0.12)', text: '#64748b', border: 'rgba(148,163,184,0.25)' },
};

const Badge = ({ color = 'gray', children }) => {
    const c = colorMap[color] || colorMap.gray;
    return (
        <span className="hr-badge" style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            borderRadius: '999px', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.02em', whiteSpace: 'nowrap',
            background: c.bg, color: c.text,
            border: `1px solid ${c.border}`,
        }}>
            {children}
        </span>
    );
};

/* ─── StatCard ───────────────────────────────────────────────────────────── */
const iconBg = {
    purple: { bg: 'rgba(168,85,247,0.18)', color: '#a855f7' },
    blue:   { bg: 'rgba(59,130,246,0.18)',  color: '#3b82f6' },
    cyan:   { bg: 'rgba(6,182,212,0.18)',   color: '#06b6d4' },
    amber:  { bg: 'rgba(245,158,11,0.18)',  color: '#f59e0b' },
    green:  { bg: 'rgba(16,185,129,0.18)',  color: '#10b981' },
    red:    { bg: 'rgba(239,68,68,0.18)',   color: '#ef4444' },
};

const StatCard = ({ label, value, sub, icon, color = 'blue' }) => {
    const ic = iconBg[color] || iconBg.blue;
    const { dark } = useTheme();
    
    return (
        <div className={`glass-card stat-card-${color} anim-enter rounded-2xl p-5 flex flex-col gap-4 cursor-default`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ic.bg, color: ic.color, flexShrink: 0,
                }}>
                    {icon}
                </div>
                <ChevronRight size={14} style={{ color: dark ? 'rgba(148,163,184,0.35)' : 'rgba(51,65,85,0.35)', marginTop: 2 }} />
            </div>
            <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: dark ? '#f1f5f9' : '#0f172a', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: dark ? 'rgba(148,163,184,0.7)' : 'rgba(51,65,85,0.7)', marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: dark ? 'rgba(148,163,184,0.55)' : 'rgba(51,65,85,0.55)', marginTop: 2 }}>{sub}</div>
            </div>
        </div>
    );
};

/* ─── TabBar ─────────────────────────────────────────────────────────────── */
const TabBar = ({ tabs, active, onChange }) => {
    const { dark } = useTheme();
    return (
        <div style={{
            display: 'flex', gap: 4, padding: '5px', borderRadius: 16,
            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
            backdropFilter: 'blur(12px)', flexWrap: 'wrap',
        }}>
            {tabs.map(t => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    style={{
                        flex: '1 1 auto', padding: '8px 18px', borderRadius: 11,
                        border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        fontFamily: 'Outfit, sans-serif',
                        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                        ...(active === t.id
                            ? { color: '#fff', background: 'linear-gradient(135deg,rgba(168,85,247,0.90),rgba(99,102,241,0.90))', boxShadow: '0 0 20px rgba(168,85,247,0.45), 0 4px 12px rgba(99,102,241,0.30)' }
                            : { color: dark ? 'rgba(148,163,184,0.75)' : 'rgba(51,65,85,0.75)', background: 'transparent' }),
                    }}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

/* ─── InfoBanner ─────────────────────────────────────────────────────────── */
const InfoBanner = ({ icon, title, desc }) => {
    const { dark } = useTheme();
    return (
        <div className="alert-banner-red anim-enter rounded-2xl p-4" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 12, color: dark ? 'rgba(148,163,184,0.75)' : 'rgba(51,65,85,0.75)', lineHeight: 1.5 }}>{desc}</div>
            </div>
        </div>
    );
};

/* ─── HRModule ───────────────────────────────────────────────────────────── */
export function HRModule() {
    const { dark } = useTheme();
    const [tab, setTab] = useState("directory");

    const tabs = [
        { id: "directory",     label: "Staff Directory" },
        { id: "credentialing", label: "Credentialing"   },
        { id: "payroll",       label: "Payroll & Comp"  },
        { id: "coverage",      label: "Coverage & PTO"  },
        { id: "training",      label: "Training"        },
    ];

    return (
        <div className="hr-module" style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <GlobalStyles dark={dark} />
            <TabBar tabs={tabs} active={tab} onChange={setTab} />

            {/* ── Staff Directory ── */}
            {tab === "directory" && (
                <div key="directory" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-enter">
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Total Staff"    value="23"  sub="Across 4 sites" icon={<Users size={20}/>}     color="purple" />
                        <StatCard label="Providers"      value="8"   sub="MD/NP/PA"        icon={<FileCheck size={20}/>}  color="blue"   />
                        <StatCard label="Admin Staff"    value="11"  sub="Non-clinical"    icon={<Calendar size={20}/>}   color="cyan"   />
                        <StatCard label="Credentialing"  value="1"   sub="Tom Bradley — NP" icon={<Clock size={20}/>}    color="amber"  />
                    </div>

                    <div className="glass-card anim-enter" style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}` }}>
                            <div className="section-title" style={{ marginBottom: 0, justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em' }}>Staff Directory</span>
                            </div>
                            <button className="add-btn" style={{ padding: '8px 18px', borderRadius: 10, border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
                                + Add Staff
                            </button>
                        </div>
                        <div className="hr-scroll" style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                                        {["Name","Role","Site","Type","License Exp.","Status"].map(h => (
                                            <th key={h} style={{ padding: '12px 20px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: dark ? 'rgba(148,163,184,0.55)' : 'rgba(51,65,85,0.55)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockData.staff.map((s, idx) => (
                                        <tr key={s.id} className="hr-row" style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`, cursor: 'pointer' }}>
                                            <td style={{ padding: '14px 20px' }}>
                                                <div className="avatar-wrap" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div className="avatar-ring" style={{
                                                        width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                                                        background: `hsl(${s.id * 47},55%,45%)`,
                                                        boxShadow: `0 2px 10px hsl(${s.id * 47},55%,30%,0.4)`,
                                                    }}>
                                                        {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f1f5f9' : '#0f172a' }}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 20px', fontSize: 13, color: dark ? 'rgba(148,163,184,0.7)' : 'rgba(51,65,85,0.7)', fontWeight: 500 }}>{s.role}</td>
                                            <td style={{ padding: '14px 20px' }}><Badge color="blue">{s.site.split(" ")[0]}</Badge></td>
                                            <td style={{ padding: '14px 20px' }}><Badge color={s.type==="Provider"?"purple":s.type==="Admin"?"cyan":"gray"}>{s.type}</Badge></td>
                                            <td style={{ padding: '14px 20px', fontSize: 13, color: dark ? 'rgba(148,163,184,0.65)' : 'rgba(51,65,85,0.65)', fontFamily: 'JetBrains Mono,monospace' }}>{s.license}</td>
                                            <td style={{ padding: '14px 20px' }}><Badge color={s.status==="Active"?"green":"amber"}>{s.status}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Credentialing ── */}
            {tab === "credentialing" && (
                <div key="credentialing" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-enter">
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Monitored"   value="22" sub="Active licenses"  icon={<CheckCircle size={20}/>} color="green" />
                        <StatCard label="Expiring"    value="3"  sub="Within 90 days"   icon={<AlertCircle size={20}/>} color="amber" />
                        <StatCard label="Expired"     value="1"  sub="Requires action"  icon={<ShieldAlert size={20}/>} color="red"   />
                        <StatCard label="Pending"     value="1"  sub="Tom Bradley NP"   icon={<Clock size={20}/>}       color="blue"  />
                    </div>

                    <InfoBanner
                        icon={<ShieldAlert size={22} color="#ef4444" strokeWidth={1.5}/>}
                        title="Revenue Impact Alert"
                        desc="Dr. Chen board certification expired 87 days ago — estimated impact: $18,400/month if not resolved."
                    />

                    <div className="glass-card anim-enter" style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}` }}>
                            <div className="section-title" style={{ marginBottom: 0, justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em' }}>Credentialing Tracker</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {mockData.credentialing.map((c, i) => {
                                const cfg = {
                                    critical: { badge:'red',   label:'EXPIRED',     bg: dark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.03)' },
                                    warning:  { badge:'amber', label:`${c.daysLeft}d`, bg: dark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.03)' },
                                    pending:  { badge:'blue',  label:'PENDING',     bg: dark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.03)' },
                                    ok:       { badge:'green', label:`${c.daysLeft}d`, bg: 'transparent' },
                                }[c.status];

                                return (
                                    <div key={i} className="hr-row" style={{
                                        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '14px 24px', gap: 14, borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}`,
                                        background: cfg.bg, cursor: 'pointer',
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f1f5f9' : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.item}</div>
                                            <div style={{ fontSize: 12, color: dark ? 'rgba(148,163,184,0.6)' : 'rgba(51,65,85,0.6)', marginTop: 2 }}>{c.provider}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <span style={{ fontSize: 12, color: dark ? 'rgba(148,163,184,0.55)' : 'rgba(51,65,85,0.55)', fontFamily: 'JetBrains Mono,monospace', whiteSpace: 'nowrap' }}>{c.expiry || '—'}</span>
                                            <Badge color={cfg.badge}>{cfg.label}</Badge>
                                            <button className="manage-btn" style={{
                                                fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 8, cursor: 'pointer',
                                                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                                border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.05)'}`,
                                                color: dark ? '#cbd5e1' : '#334155', fontFamily: 'Outfit,sans-serif',
                                            }}>
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Payroll ── */}
            {tab === "payroll" && (
                <div key="payroll" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-enter">
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="Monthly Payroll"    value={fmtK(mockData.expenses.payroll)}      sub="Feb 2026 total"     icon={<DollarSign size={20}/>} color="purple" />
                        <StatCard label="Per Provider Avg"   value={fmtK(mockData.expenses.payroll/4)}    sub="Salary + burden"    icon={<Users size={20}/>}     color="blue"   />
                        <StatCard label="Payroll Burden"     value="24.1%"                                sub="Benefits + taxes"   icon={<FileCheck size={20}/>}  color="amber"  />
                    </div>

                    <div className="glass-card anim-enter" style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}` }}>
                            <div className="section-title" style={{ marginBottom: 0, justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em' }}>Provider Compensation Overview</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10 }}>
                            {mockData.revenueByProvider.map(p => (
                                <div key={p.name} className="hr-row" style={{
                                    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 16px', borderRadius: 14, gap: 14, cursor: 'pointer',
                                    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
                                    transition: 'background 0.2s ease, border-color 0.2s ease',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 14, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                            boxShadow: '0 4px 14px rgba(99,102,241,0.38)', flexShrink: 0,
                                        }}>
                                            {p.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a' }}>{p.name}</div>
                                            <div style={{ fontSize: 12, color: dark ? 'rgba(148,163,184,0.55)' : 'rgba(51,65,85,0.55)', marginTop: 2 }}>Base salary + productivity bonus</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="hr-mono" style={{ fontSize: 15, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a' }}>
                                                {fmtK(p.expenses)}<span style={{ fontSize: 11, color: dark ? 'rgba(148,163,184,0.45)' : 'rgba(51,65,85,0.45)' }}>/mo</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: dark ? 'rgba(148,163,184,0.5)' : 'rgba(51,65,85,0.5)', marginTop: 2 }}>
                                                wRVU: <span style={{ color: dark ? '#cbd5e1' : '#334155', fontFamily: 'JetBrains Mono,monospace' }}>{p.rvu.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <Badge color="green">Active</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Coverage & PTO ── */}
            {tab === "coverage" && (
                <div key="coverage" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="anim-enter">
                    <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14 }}>
                        <StatCard label="PTO Requests"    value="3"     sub="Awaiting approval"  icon={<Calendar size={20}/>}     color="cyan"   />
                        <StatCard label="Coverage Gaps"   value="0"     sub="All shifts covered"  icon={<CheckCircle size={20}/>}  color="green"  />
                        <StatCard label="Call Schedule"   value="4"     sub="Providers on call"   icon={<Clock size={20}/>}        color="blue"   />
                        <StatCard label="PTO Balance Avg" value="12.4d" sub="Across all staff"    icon={<Users size={20}/>}        color="purple" />
                    </div>

                    <div className="glass-card anim-enter" style={{ borderRadius: 20, padding: '22px 24px' }}>
                        <div className="section-title" style={{ marginBottom: 16, justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em' }}>Coverage Calendar — March 2026</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8, marginBottom: 8 }}>
                            {["Mon","Tue","Wed","Thu","Fri"].map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: dark ? 'rgba(148,163,184,0.45)' : 'rgba(51,65,85,0.45)', paddingBottom: 8 }}>{d}</div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
                            {Array.from({ length: 20 }, (_, i) => {
                                const pto = [2,7,12,15].includes(i);
                                return (
                                    <div key={i} className={`cal-day ${pto ? 'cal-day-pto' : ''}`} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        padding: '14px 8px', borderRadius: 12, cursor: 'pointer',
                                        border: `1px solid ${pto ? 'rgba(99,102,241,0.30)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')}`,
                                        background: pto ? 'rgba(99,102,241,0.14)' : (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                                    }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: pto ? (dark ? '#a5b4fc' : '#818cf8') : (dark ? 'rgba(148,163,184,0.65)' : 'rgba(51,65,85,0.65)') }}>{i+1}</span>
                                        {pto && <span style={{ fontSize: 9, fontWeight: 700, color: dark ? '#818cf8' : '#6366f1', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>PTO</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Training ── */}
            {tab === "training" && (
                <div key="training" className="glass-card anim-enter" style={{ borderRadius: 20, padding: '22px 24px', marginBottom: 24 }}>
                    <div className="section-title" style={{ marginBottom: 16, justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em' }}>Training & Compliance Status</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { name: "HIPAA Privacy & Security",    completed: 21, total: 23, due: "2026-04-01" },
                            { name: "OSHA Safety Training",        completed: 18, total: 23, due: "2026-03-15" },
                            { name: "MA Phlebotomy Certification", completed: 4,  total: 5,  due: "2026-06-01" },
                            { name: "EMG/EEG Prep Training",       completed: 3,  total: 5,  due: "2026-05-30" },
                            { name: "Fire Safety & Evacuation",    completed: 23, total: 23, due: "2026-12-01" },
                        ].map((tr, idx) => {
                            const pct = tr.completed / tr.total;
                            const done = tr.completed === tr.total;
                            const barColor = done ? '#10b981' : pct > 0.8 ? '#f59e0b' : '#6366f1';
                            return (
                                <div key={tr.name} className="training-card" style={{
                                    padding: '16px 18px', borderRadius: 14,
                                    animationDelay: `${idx * 60}ms`,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: dark ? '#f1f5f9' : '#0f172a' }}>{tr.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span className="hr-mono" style={{ fontSize: 12, fontWeight: 600, color: dark ? 'rgba(148,163,184,0.6)' : 'rgba(51,65,85,0.6)' }}>{tr.completed}/{tr.total}</span>
                                            <Badge color={done ? 'green' : pct > 0.8 ? 'amber' : 'red'}>
                                                {done ? 'Complete' : `${Math.round(pct*100)}%`}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 999,
                                            width: `${pct * 100}%`,
                                            background: barColor,
                                            boxShadow: `0 0 10px ${barColor}80`,
                                            transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
                                        }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: dark ? 'rgba(148,163,184,0.45)' : 'rgba(51,65,85,0.45)', marginTop: 8 }}>Due: {tr.due}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}