import React, { useState } from 'react';
import { useTheme } from '../App';
import { mockData } from '../mockData';
import { ChevronRight, UserPlus, Shield, MapPin, Bell, Check } from 'lucide-react';

/* ─── Global Styles ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .set-module * { font-family: 'Outfit', sans-serif; }
        .set-mono { font-family: 'JetBrains Mono', monospace !important; }

        /* ── Glass card ── */
        .set-glass {
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px) saturate(160%);
            -webkit-backdrop-filter: blur(20px) saturate(160%);
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .set-glass:hover {
            box-shadow: 0 16px 48px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.10);
            border-color: rgba(255,255,255,0.13);
        }

        /* ── Entrance animation ── */
        @keyframes setFadeIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .set-enter { animation: setFadeIn 0.38s cubic-bezier(0.22,1,0.36,1) both; }
        .set-stagger > *:nth-child(1) { animation-delay: 0ms; }
        .set-stagger > *:nth-child(2) { animation-delay: 70ms; }
        .set-stagger > *:nth-child(3) { animation-delay: 140ms; }
        .set-stagger > *:nth-child(4) { animation-delay: 210ms; }

        /* ── Section title ── */
        .set-section-title {
            display: flex; align-items: center; gap: 10px;
        }
        .set-section-title::before {
            content: ''; display: block; width: 4px; height: 18px; border-radius: 2px;
            background: linear-gradient(180deg,#6366f1,#3b82f6); flex-shrink: 0;
        }

        /* ── User row ── */
        .set-user-row {
            transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .set-user-row:hover {
            background: rgba(59,130,246,0.07) !important;
            border-color: rgba(59,130,246,0.28) !important;
            transform: translateX(2px);
        }

        /* ── Invite button ── */
        .set-invite-btn {
            background: linear-gradient(135deg,#6366f1,#3b82f6);
            box-shadow: 0 4px 14px rgba(99,102,241,0.40);
            transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .set-invite-btn:hover {
            opacity: 0.90; transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(99,102,241,0.55);
        }
        .set-invite-btn:active { transform: translateY(0); }

        /* ── Role card ── */
        .set-role-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .set-role-card:hover {
            border-color: rgba(99,102,241,0.35) !important;
            box-shadow: 0 6px 22px rgba(99,102,241,0.13);
            transform: translateY(-2px);
        }

        /* ── Permission pill ── */
        .set-perm-pill {
            transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
        }
        .set-perm-pill:hover {
            background: rgba(99,102,241,0.20) !important;
            color: #a5b4fc !important;
            transform: scale(1.05);
        }

        /* ── Site card ── */
        .set-site-card {
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .set-site-card:hover {
            border-color: rgba(16,185,129,0.35) !important;
            box-shadow: 0 6px 22px rgba(16,185,129,0.13);
            transform: translateY(-3px);
        }

        /* ── Notification row ── */
        .set-notif-row {
            transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
            border: 1px solid rgba(255,255,255,0.06);
        }
        .set-notif-row:hover {
            background: rgba(99,102,241,0.06) !important;
            border-color: rgba(99,102,241,0.22) !important;
            transform: translateX(2px);
        }

        /* ── Toggle switch ── */
        .set-toggle {
            position: relative; display: inline-flex; align-items: center;
            width: 42px; height: 24px; border-radius: 999px;
            cursor: pointer; border: none; outline: none; flex-shrink: 0;
            transition: background 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
        }
        .set-toggle-on  {
            background: linear-gradient(135deg,#6366f1,#3b82f6);
            box-shadow: 0 0 14px rgba(99,102,241,0.45);
        }
        .set-toggle-off {
            background: rgba(148,163,184,0.20);
            box-shadow: none;
        }
        .set-toggle-knob {
            position: absolute; width: 17px; height: 17px; border-radius: 50%;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.35);
            transition: left 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .set-toggle-knob-on  { left: calc(100% - 20px); }
        .set-toggle-knob-off { left: 3px; }

        /* ── Avatar ── */
        .set-avatar {
            transition: box-shadow 0.25s ease, transform 0.2s ease;
        }
        .set-avatar:hover {
            transform: scale(1.08);
            box-shadow: 0 0 0 3px rgba(99,102,241,0.50), 0 4px 14px rgba(99,102,241,0.30);
        }

        /* ── Scrollbar ── */
        .set-scroll::-webkit-scrollbar { width: 4px; }
        .set-scroll::-webkit-scrollbar-track { background: transparent; }
        .set-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 99px; }
    `}</style>
);

/* ─── Badge ───────────────────────────────────────────────────────────── */
const colorMap = {
    green:  { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.28)' },
    blue:   { bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa', border: 'rgba(59,130,246,0.28)' },
    cyan:   { bg: 'rgba(6,182,212,0.15)',   text: '#22d3ee', border: 'rgba(6,182,212,0.28)'  },
    purple: { bg: 'rgba(168,85,247,0.15)',  text: '#c084fc', border: 'rgba(168,85,247,0.28)' },
    amber:  { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.28)' },
    red:    { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.28)'  },
    gray:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.22)'},
};
const Badge = ({ color = 'gray', children }) => {
    const c = colorMap[color] || colorMap.gray;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
            whiteSpace: 'nowrap', background: c.bg, color: c.text, border: `1px solid ${c.border}`,
            transition: 'filter 0.2s',
        }}>{children}</span>
    );
};

/* ─── SectionHeader ───────────────────────────────────────────────────── */
const SectionHeader = ({ title, right }) => (
    <div className="set-section-title" style={{ marginBottom: 18, justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>{title}</span>
        {right && <div>{right}</div>}
    </div>
);

/* ─── Avatar initials ─────────────────────────────────────────────────── */
const avatarGradients = [
    'linear-gradient(135deg,#3b82f6,#6366f1)',
    'linear-gradient(135deg,#8b5cf6,#6366f1)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
];

/* ─── SettingsModule ──────────────────────────────────────────────────── */
export function SettingsModule() {
    const { dark } = useTheme();
    const [prefs, setPrefs] = useState([true, true, true, false, true, false]);

    const prefLabels = [
        "Credentialing expiration alerts (90/60/30 days)",
        "Contract renewal alerts (90/60/30 days)",
        "AR milestone alerts",
        "Cash position alerts",
        "Weekly financial summary email",
        "Daily digest mode",
    ];

    return (
        <div className="set-module" style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
            <GlobalStyles />

            {/* ── User Management + RBAC ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>

                {/* User Management */}
                <div className="set-glass set-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column' }}>
                    <SectionHeader
                        title="User Management"
                        right={
                            <button className="set-invite-btn" style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '7px 16px', borderRadius: 10, border: 'none',
                                color: '#fff', fontSize: 12, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap',
                            }}>
                                <UserPlus size={13} /> Invite User
                            </button>
                        }
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { name: "Maria Gonzalez",  role: "Practice Admin",  email: "mgonzalez@shahidrafiq.com", access: "Full Access",     color: "green",  grad: 0 },
                            { name: "Dr. Shahid Rafiq",role: "Lead Physician",  email: "srafiq@shahidrafiq.com",    access: "Executive View",   color: "blue",   grad: 1 },
                            { name: "James Park",      role: "Billing Manager", email: "jpark@shahidrafiq.com",     access: "Financial Only",   color: "cyan",   grad: 2 },
                        ].map((u, idx) => (
                            <div key={u.name} className="set-user-row set-enter" style={{
                                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                                gap: 12, padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                                background: 'rgba(255,255,255,0.03)',
                                animationDelay: `${idx * 60}ms`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                                    <div className="set-avatar" style={{
                                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                        background: avatarGradients[u.grad],
                                        boxShadow: '0 4px 14px rgba(99,102,241,0.32)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 700, color: '#fff',
                                    }}>
                                        {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.50)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                                    </div>
                                </div>
                                <Badge color={u.color}>{u.access}</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role-Based Access Control */}
                <div className="set-glass set-enter rounded-2xl p-6" style={{ display: 'flex', flexDirection: 'column', animationDelay: '70ms' }}>
                    <SectionHeader title="Role-Based Access Control" right={<Shield size={16} style={{ color: 'rgba(148,163,184,0.35)' }} />} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { role: "Practice Admin",  perms: ["Financial","HR","Contracts","Settings"],         color: "green"  },
                            { role: "Executive View",  perms: ["Dashboard","Financial Read","Reports"],          color: "blue"   },
                            { role: "Billing Manager", perms: ["Financial","AR","Reports"],                      color: "cyan"   },
                            { role: "HR Coordinator",  perms: ["HR Module","Credentialing"],                     color: "purple" },
                        ].map((r, idx) => (
                            <div key={r.role} className="set-role-card set-enter" style={{
                                padding: '14px 16px', borderRadius: 14, cursor: 'default',
                                background: 'rgba(255,255,255,0.03)',
                                animationDelay: `${idx * 55}ms`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{r.role}</span>
                                    <Badge color={r.color}>Active</Badge>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {r.perms.map(p => (
                                        <span key={p} className="set-perm-pill" style={{
                                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8,
                                            background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
                                            border: '1px solid rgba(255,255,255,0.09)',
                                            cursor: 'default',
                                        }}>{p}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Site Configuration ── */}
            <div className="set-glass set-enter rounded-2xl p-6" style={{ animationDelay: '140ms' }}>
                <SectionHeader title="Site Configuration" right={<MapPin size={16} style={{ color: 'rgba(148,163,184,0.35)' }} />} />
                <div className="set-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                    {mockData.sites.slice(1).map((site, idx) => (
                        <div key={site} className="set-site-card set-enter" style={{
                            padding: '16px', borderRadius: 14, cursor: 'default',
                            background: 'rgba(255,255,255,0.03)',
                            animationDelay: `${idx * 60}ms`,
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site}</div>
                            <Badge color="green">Active</Badge>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12 }}>
                                <div style={{
                                    width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                                    background: '#10b981', boxShadow: '0 0 7px rgba(16,185,129,0.60)',
                                }} />
                                <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(148,163,184,0.50)' }}>Reporting enabled</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Notification Preferences ── */}
            <div className="set-glass set-enter rounded-2xl p-6" style={{ marginBottom: 24, animationDelay: '200ms' }}>
                <SectionHeader title="Notification Preferences" right={<Bell size={16} style={{ color: 'rgba(148,163,184,0.35)' }} />} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 10 }}>
                    {prefLabels.map((label, i) => (
                        <div key={i} className="set-notif-row set-enter" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: 16, padding: '13px 16px', borderRadius: 13, cursor: 'default',
                            background: 'rgba(255,255,255,0.02)',
                            animationDelay: `${i * 45}ms`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: prefs[i] ? 'rgba(99,102,241,0.18)' : 'rgba(148,163,184,0.10)',
                                    transition: 'background 0.3s ease',
                                }}>
                                    <Bell size={13} style={{ color: prefs[i] ? '#a5b4fc' : 'rgba(148,163,184,0.40)', transition: 'color 0.3s ease' }} />
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 500, color: prefs[i] ? '#e2e8f0' : 'rgba(148,163,184,0.50)', transition: 'color 0.3s ease', lineHeight: 1.4 }}>{label}</span>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => setPrefs(prev => prev.map((v, j) => j === i ? !v : v))}
                                className={`set-toggle ${prefs[i] ? 'set-toggle-on' : 'set-toggle-off'}`}
                                aria-checked={prefs[i]}
                            >
                                <span className={`set-toggle-knob ${prefs[i] ? 'set-toggle-knob-on' : 'set-toggle-knob-off'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}