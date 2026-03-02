import React, { useState } from 'react';
import { useTheme } from '../App';
import { mockData } from '../mockData';
import { FileText, FileCheck, AlertTriangle, FileSignature, Search, Upload, ChevronRight, ArrowUpRight } from 'lucide-react';

/* ─── Global Styles ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .con-module * { font-family: 'Outfit', sans-serif; }
        .con-mono { font-family: 'JetBrains Mono', monospace !important; }

        /* ── Glass base ── */
        .con-glass {
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .con-glass:hover {
            box-shadow: 0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.10);
            border-color: rgba(255,255,255,0.13);
        }

        /* ── Stat card per-color glows ── */
        .con-stat-cyan:hover   { box-shadow: 0 0 0 1px rgba(6,182,212,0.35),   0 12px 40px rgba(6,182,212,0.18); }
        .con-stat-green:hover  { box-shadow: 0 0 0 1px rgba(16,185,129,0.35),  0 12px 40px rgba(16,185,129,0.18); }
        .con-stat-amber:hover  { box-shadow: 0 0 0 1px rgba(245,158,11,0.35),  0 12px 40px rgba(245,158,11,0.18); }
        .con-stat-blue:hover   { box-shadow: 0 0 0 1px rgba(59,130,246,0.35),  0 12px 40px rgba(59,130,246,0.18); }
        .con-stat-purple:hover { box-shadow: 0 0 0 1px rgba(168,85,247,0.35),  0 12px 40px rgba(168,85,247,0.18); }
        .con-stat-red:hover    { box-shadow: 0 0 0 1px rgba(239,68,68,0.35),   0 12px 40px rgba(239,68,68,0.18); }

        /* ── Entrance animation ── */
        @keyframes conFadeIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .con-enter { animation: conFadeIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        .con-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .con-stagger > *:nth-child(2) { animation-delay: 55ms; }
        .con-stagger > *:nth-child(3) { animation-delay: 110ms; }
        .con-stagger > *:nth-child(4) { animation-delay: 165ms; }

        /* ── Tab bar ── */
        .con-tab-active {
            background: linear-gradient(135deg, rgba(6,182,212,0.90) 0%, rgba(59,130,246,0.90) 100%);
            box-shadow: 0 0 22px rgba(6,182,212,0.45), 0 4px 14px rgba(59,130,246,0.28);
        }

        /* ── Section title ── */
        .con-section-title {
            display: flex; align-items: center; gap: 10px;
        }
        .con-section-title::before {
            content: ''; display: block; width: 4px; height: 18px; border-radius: 2px;
            background: linear-gradient(180deg,#06b6d4,#3b82f6); flex-shrink: 0;
        }

        /* ── Search input ── */
        .con-search {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.09);
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .con-search:focus-within {
            border-color: rgba(6,182,212,0.50);
            background: rgba(6,182,212,0.06);
            box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
        }
        .con-search input { background: transparent; border: none; outline: none; color: #f1f5f9; }
        .con-search input::placeholder { color: rgba(148,163,184,0.45); }

        /* ── Upload button ── */
        .con-upload-btn {
            background: linear-gradient(135deg,#06b6d4,#3b82f6);
            box-shadow: 0 4px 14px rgba(6,182,212,0.42);
            transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .con-upload-btn:hover {
            opacity: 0.90; transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(6,182,212,0.55);
        }
        .con-upload-btn:active { transform: translateY(0); }

        /* ── Contract row ── */
        .con-row {
            transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .con-row:hover {
            background: rgba(6,182,212,0.06) !important;
            transform: translateX(2px);
        }
        .con-row:last-child { border-bottom: none; }

        /* ── View / Manage button ── */
        .con-btn {
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.04);
            color: #94a3b8;
        }
        .con-btn:hover {
            background: rgba(6,182,212,0.15);
            border-color: rgba(6,182,212,0.40);
            color: #22d3ee;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(6,182,212,0.22);
        }

        /* ── Digitization banner ── */
        .con-banner {
            background: rgba(6,182,212,0.08);
            border: 1px solid rgba(6,182,212,0.22);
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(6,182,212,0.10), inset 0 1px 0 rgba(255,255,255,0.04);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .con-banner:hover {
            border-color: rgba(6,182,212,0.38);
            box-shadow: 0 6px 28px rgba(6,182,212,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* ── Employment card ── */
        .con-emp-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .con-emp-card:hover {
            border-color: rgba(59,130,246,0.38) !important;
            box-shadow: 0 6px 24px rgba(59,130,246,0.14);
            transform: translateY(-2px);
        }

        /* ── Compare button ── */
        .con-compare-btn {
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(59,130,246,0.35);
            background: rgba(59,130,246,0.08);
            color: #60a5fa;
        }
        .con-compare-btn:hover {
            background: rgba(59,130,246,0.18);
            border-color: rgba(59,130,246,0.55);
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(59,130,246,0.22);
        }

        /* ── Lifecycle card ── */
        .con-lifecycle-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.06);
        }
        .con-lifecycle-card:hover {
            border-color: rgba(245,158,11,0.35) !important;
            box-shadow: 0 6px 24px rgba(245,158,11,0.13);
            transform: translateX(4px);
        }

        /* ── Start Renewal button ── */
        .con-renew-btn {
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(255,255,255,0.04);
            color: #94a3b8;
        }
        .con-renew-btn:hover {
            background: rgba(245,158,11,0.15);
            border-color: rgba(245,158,11,0.40);
            color: #fbbf24;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(245,158,11,0.22);
        }

        /* ── Payor table row ── */
        .con-table-row {
            transition: background 0.15s ease, transform 0.15s ease;
            border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .con-table-row:hover {
            background: rgba(6,182,212,0.06) !important;
            transform: translateX(1px);
        }
        .con-table-row:last-child { border-bottom: none; }

        /* ── Scrollbar ── */
        .con-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .con-scroll::-webkit-scrollbar-track { background: transparent; }
        .con-scroll::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.35); border-radius: 99px; }
    `}</style>
);

/* ─── Badge ───────────────────────────────────────────────────────────── */
const colorMap = {
    cyan:   { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee', border: 'rgba(6,182,212,0.28)'   },
    green:  { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.28)'  },
    amber:  { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.28)'  },
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.28)'  },
    purple: { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.28)'  },
    red:    { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.28)'   },
    gray:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)' },
};
const Badge = ({ color = 'gray', children }) => {
    const c = colorMap[color] || colorMap.gray;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
            whiteSpace: 'nowrap', background: c.bg, color: c.text, border: `1px solid ${c.border}`,
            transition: 'filter 0.2s, transform 0.2s',
        }}>{children}</span>
    );
};

/* ─── Icon backgrounds ────────────────────────────────────────────────── */
const iconBg = {
    cyan:   { bg: 'rgba(6,182,212,0.18)',  color: '#22d3ee' },
    green:  { bg: 'rgba(16,185,129,0.18)', color: '#34d399' },
    amber:  { bg: 'rgba(245,158,11,0.18)', color: '#fbbf24' },
    blue:   { bg: 'rgba(59,130,246,0.18)', color: '#60a5fa' },
    purple: { bg: 'rgba(168,85,247,0.18)', color: '#c084fc' },
};

/* ─── StatCard ────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, color = 'cyan' }) => {
    const ic = iconBg[color] || iconBg.cyan;
    return (
        <div className={`con-glass con-stat-${color} con-enter rounded-2xl p-5 flex flex-col gap-4 cursor-default`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ic.bg, color: ic.color, flexShrink: 0,
                }}>{icon}</div>
                <ChevronRight size={14} style={{ color: 'rgba(148,163,184,0.28)', marginTop: 2 }} />
            </div>
            <div>
                <div className="con-mono" style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(148,163,184,0.60)', marginTop: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(148,163,184,0.45)', marginTop: 2 }}>{sub}</div>
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
                flex: '1 1 auto', padding: '8px 18px', borderRadius: 11,
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                ...(active === t.id
                    ? { color: '#fff', background: 'linear-gradient(135deg,rgba(6,182,212,0.90),rgba(59,130,246,0.90))', boxShadow: '0 0 20px rgba(6,182,212,0.45),0 4px 12px rgba(59,130,246,0.28)' }
                    : { color: 'rgba(148,163,184,0.75)', background: 'transparent' }),
            }}>{t.label}</button>
        ))}
    </div>
);

/* ─── SectionHeader ───────────────────────────────────────────────────── */
const SectionHeader = ({ title, right }) => (
    <div className="con-section-title" style={{ marginBottom: 16, justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{title}</span>
        {right && <div>{right}</div>}
    </div>
);

/* ─── ContractsModule ─────────────────────────────────────────────────── */
export function ContractsModule() {
    const { dark } = useTheme();
    const [tab, setTab] = useState("repository");
    const [search, setSearch] = useState("");

    const tabs = [
        { id: "repository", label: "Repository"  },
        { id: "employment", label: "Employment"  },
        { id: "lifecycle",  label: "Lifecycle"   },
        { id: "payor",      label: "Payor Intel" },
    ];

    const filtered = mockData.contracts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="con-module" style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <GlobalStyles />
            <TabBar tabs={tabs} active={tab} onChange={setTab} />

            {/* ── Repository ── */}
            {tab === "repository" && (
                <div key="repository" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="con-enter">
                    {/* Stat cards */}
                    <div className="con-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
                        <StatCard label="Total Contracts" value="30+"  sub="8 digitized so far"  icon={<FileText size={20}/>}      color="cyan"  />
                        <StatCard label="Active"          value="6"    sub="In force"             icon={<FileCheck size={20}/>}     color="green" />
                        <StatCard label="Renewal Window"  value="2"    sub="Review required"      icon={<AlertTriangle size={20}/>} color="amber" />
                        <StatCard label="Draft / Pending" value="1"    sub="Aetna agreement"      icon={<FileSignature size={20}/>} color="blue"  />
                    </div>

                    {/* Digitization banner */}
                    <div className="con-banner con-enter rounded-2xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(6,182,212,0.18)', color: '#22d3ee', flexShrink: 0,
                            }}>
                                <Upload size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#67e8f9', marginBottom: 2 }}>Digitization Target: 30+ contracts remain in filing cabinets</div>
                                <div style={{ fontSize: 12, color: 'rgba(103,232,249,0.55)' }}>Target: 80% digitized by Day 45 of pilot. Upload outstanding provider agreements ASAP.</div>
                            </div>
                        </div>
                    </div>

                    {/* Contract list */}
                    <div className="con-glass con-enter rounded-2xl" style={{ overflow: 'hidden' }}>
                        {/* Search + Upload header */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                            gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                        }}>
                            <div className="con-search" style={{
                                flex: '1 1 260px', maxWidth: 400,
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 14px', borderRadius: 12,
                            }}>
                                <Search size={15} style={{ color: 'rgba(148,163,184,0.45)', flexShrink: 0 }} />
                                <input
                                    style={{ flex: 1, fontSize: 13, fontWeight: 500, fontFamily: 'Outfit,sans-serif', minWidth: 0 }}
                                    placeholder="Search contracts..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="con-upload-btn" style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '9px 20px', borderRadius: 11, border: 'none',
                                color: '#fff', fontSize: 12, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'Outfit,sans-serif', flexShrink: 0,
                            }}>
                                <Upload size={14} /> Upload
                            </button>
                        </div>

                        {/* Contract rows */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {filtered.map(c => {
                                const typeColor   = { Payor: "blue", Employment: "purple", Institutional: "cyan", Vendor: "gray" }[c.type] || "gray";
                                const statusColor = { Active: "green", "Renewal Window": "amber", Draft: "blue", Expired: "red" }[c.status] || "gray";
                                return (
                                    <div key={c.id} className="con-row" style={{
                                        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                                        gap: 16, padding: '14px 20px', cursor: 'pointer',
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>{c.name}</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                                                <Badge color={typeColor}>{c.type}</Badge>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.50)',
                                                    paddingLeft: 8, borderLeft: '1px solid rgba(255,255,255,0.10)', whiteSpace: 'nowrap',
                                                }}>{c.sites}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div className="con-mono" style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{c.value}</div>
                                                <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.45)', marginTop: 2 }}>Exp: {c.expiry}</div>
                                            </div>
                                            <Badge color={statusColor}>{c.status}</Badge>
                                            <button className="con-btn" style={{
                                                fontSize: 11, fontWeight: 600, padding: '5px 14px',
                                                borderRadius: 8, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                                            }}>View</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Employment ── */}
            {tab === "employment" && (
                <div key="employment" className="con-glass con-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column' }}>
                    <SectionHeader
                        title="Provider Employment Contracts"
                        right={
                            <button className="con-compare-btn" style={{
                                padding: '6px 16px', borderRadius: 9, fontSize: 12,
                                fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                            }}>
                                Compare Side-by-Side
                            </button>
                        }
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { provider: "Dr. Shahid Rafiq",   base: "$380K", bonus: "wRVU >1,800", nonCompete: "25mi / 2yr", tail: "Covered", expiry: "Jun 2027" },
                            { provider: "Dr. Linda Chen",     base: "$340K", bonus: "wRVU >1,600", nonCompete: "20mi / 2yr", tail: "Covered", expiry: "Sep 2026" },
                            { provider: "Dr. Arjun Patel",    base: "$340K", bonus: "wRVU >1,600", nonCompete: "20mi / 2yr", tail: "Covered", expiry: "Jan 2027" },
                            { provider: "Dr. Sarah Williams", base: "$360K", bonus: "wRVU >1,700", nonCompete: "25mi / 2yr", tail: "Covered", expiry: "Dec 2027" },
                        ].map((emp, idx) => (
                            <div key={emp.provider} className="con-emp-card con-enter" style={{
                                padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
                                background: 'rgba(255,255,255,0.03)',
                                animationDelay: `${idx * 55}ms`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 700, color: '#fff',
                                        }}>
                                            {emp.provider.split(' ').slice(1).map(n=>n[0]).join('').slice(0,2)}
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{emp.provider}</span>
                                    </div>
                                    <Badge color="green">Active</Badge>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 12 }}>
                                    {[
                                        { label: "Base Salary",  value: emp.base       },
                                        { label: "Productivity", value: emp.bonus       },
                                        { label: "Non-Compete",  value: emp.nonCompete  },
                                        { label: "Tail Coverage",value: emp.tail        },
                                        { label: "Expires",      value: emp.expiry      },
                                    ].map(f => (
                                        <div key={f.label}>
                                            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(148,163,184,0.45)', marginBottom: 4 }}>{f.label}</div>
                                            <div className="con-mono" style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Lifecycle ── */}
            {tab === "lifecycle" && (
                <div key="lifecycle" className="con-glass con-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column' }}>
                    <SectionHeader title="Contract Renewal Calendar" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { name: "BlueCross Provider Agreement",    expiry: "Apr 15, 2026", daysLeft: 47,  urgency: "high"   },
                            { name: "Metro Hospital Service Agreement", expiry: "Jun 30, 2026", daysLeft: 123, urgency: "medium" },
                            { name: "Dr. Chen Employment Contract",    expiry: "Sep 1, 2026",  daysLeft: 187, urgency: "medium" },
                            { name: "eClinicalWorks EHR License",      expiry: "Aug 31, 2026", daysLeft: 185, urgency: "low"    },
                            { name: "Office Lease — Main Campus",      expiry: "Jan 1, 2028",  daysLeft: 674, urgency: "low"    },
                        ].map((c, idx) => {
                            const dotColor = c.urgency === "high" ? '#fbbf24' : c.urgency === "medium" ? '#60a5fa' : '#34d399';
                            const dotGlow  = c.urgency === "high" ? 'rgba(245,158,11,0.55)' : c.urgency === "medium" ? 'rgba(59,130,246,0.50)' : 'rgba(16,185,129,0.50)';
                            const daysColor = c.daysLeft < 60 ? '#fbbf24' : '#f1f5f9';
                            const daysShadow = c.daysLeft < 60 ? '0 0 14px rgba(245,158,11,0.35)' : 'none';
                            return (
                                <div key={c.name} className="con-lifecycle-card con-enter" style={{
                                    display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                                    gap: 16, padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)',
                                    animationDelay: `${idx * 55}ms`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                        <div style={{
                                            width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                                            background: dotColor, boxShadow: `0 0 8px ${dotGlow}`,
                                        }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.50)', marginTop: 3 }}>Expires: {c.expiry}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="con-mono" style={{ fontSize: 16, fontWeight: 800, color: daysColor, textShadow: daysShadow, letterSpacing: '-0.02em' }}>{c.daysLeft}d</div>
                                            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(148,163,184,0.38)', marginTop: 1 }}>remaining</div>
                                        </div>
                                        <button className="con-renew-btn" style={{
                                            fontSize: 11, fontWeight: 600, padding: '6px 14px',
                                            borderRadius: 9, cursor: 'pointer', fontFamily: 'Outfit,sans-serif',
                                        }}>Start Renewal</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Payor Intel ── */}
            {tab === "payor" && (
                <div key="payor" className="con-glass con-enter rounded-2xl p-6" style={{ marginBottom: 24 }}>
                    <SectionHeader title="Payor Rate Comparison — Select CPT Codes" />
                    <div className="con-scroll" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                                    {["CPT Code", "Description", "Medicare", "BlueCross", "Aetna", "Medicaid"].map((h, idx) => (
                                        <th key={h} style={{
                                            padding: '12px 18px',
                                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em',
                                            color: 'rgba(148,163,184,0.50)',
                                            textAlign: idx < 2 ? 'left' : 'right',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { cpt: "99213", desc: "Office Visit - Level 3",  mc: "$82",  bc: "$94",  ae: "$89",  md: "$63"  },
                                    { cpt: "99214", desc: "Office Visit - Level 4",  mc: "$116", bc: "$135", ae: "$128", md: "$89"  },
                                    { cpt: "95910", desc: "Nerve Conduction Study",  mc: "$148", bc: "$172", ae: "$162", md: "$118" },
                                    { cpt: "95930", desc: "EEG - Routine",           mc: "$194", bc: "$224", ae: "$218", md: "$148" },
                                    { cpt: "64615", desc: "Botox - Migraine",        mc: "$88",  bc: "$102", ae: "$96",  md: "$71"  },
                                ].map(row => (
                                    <tr key={row.cpt} className="con-table-row" style={{ cursor: 'pointer' }}>
                                        <td style={{ padding: '14px 18px' }}>
                                            <span className="con-mono" style={{
                                                fontSize: 13, fontWeight: 700, color: '#22d3ee',
                                                textShadow: '0 0 10px rgba(6,182,212,0.35)',
                                            }}>{row.cpt}</span>
                                        </td>
                                        <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>{row.desc}</td>
                                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                            <span className="con-mono" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(148,163,184,0.65)' }}>{row.mc}</span>
                                        </td>
                                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                            <span className="con-mono" style={{ fontSize: 13, fontWeight: 700, color: '#34d399', textShadow: '0 0 10px rgba(16,185,129,0.30)' }}>{row.bc}</span>
                                        </td>
                                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                            <span className="con-mono" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(148,163,184,0.65)' }}>{row.ae}</span>
                                        </td>
                                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                            <span className="con-mono" style={{ fontSize: 13, fontWeight: 700, color: '#f87171', textShadow: '0 0 10px rgba(239,68,68,0.28)' }}>{row.md}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}