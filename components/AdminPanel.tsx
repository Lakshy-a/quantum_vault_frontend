'use client';
import { useState, useCallback } from 'react';
import { SiteConfig, ThemeConfig, PaperConfig, NoteConfig, CustomPageConfig } from '@/lib/types';
import { generateThemeVars } from '@/lib/store';
import { api } from '@/lib/api';
import { ConfirmModal } from './ConfirmModal';

interface AdminPanelProps {
  config: SiteConfig;
  onConfigChange: (config: SiteConfig) => void;
  onRefresh?: () => void;
  onToast: (msg: string) => void;
  isLoggedIn: boolean;
  onLogin: (id: string, pass: string) => Promise<boolean>;
  onLogout: () => void;
}

type AdminTab = 'overview' | 'themes' | 'branches' | 'papers' | 'notes' | 'syllabus' | 'pages' | 'settings';

const mono = "'JetBrains Mono', monospace";
const serif = "'Playfair Display', serif";
const sans = "'Figtree', sans-serif";

const cardBase: React.CSSProperties = { background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: '12px', padding: '1.5rem', transition: 'all .2s' };
const labelStyle: React.CSSProperties = { fontFamily: mono, fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { background: 'var(--bg3)', border: '1px solid var(--bd2)', borderRadius: '6px', padding: '9px 12px', fontFamily: sans, fontSize: '13px', color: 'var(--ink)', outline: 'none', width: '100%', transition: 'border-color .2s' };

function HoverCard({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) {
  return (
    <div
      style={{ ...cardBase, ...style }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd)'; e.currentTarget.style.background = 'var(--bg2)'; }}
      {...rest}
    >{children}</div>
  );
}

function BtnPrimary({ children, onClick, style, disabled }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ fontFamily: mono, fontSize: '12px', padding: '8px 18px', borderRadius: '6px', cursor: disabled ? 'default' : 'pointer', background: disabled ? 'var(--bg4)' : 'var(--accent)', border: 'none', color: disabled ? 'var(--ink3)' : 'var(--bg)', fontWeight: 500, transition: 'all .2s', ...style }}
    onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'var(--accent2)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
    onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'none'; } }}
  >{children}</button>;
}

function BtnSecondary({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return <button onClick={onClick} style={{ fontFamily: mono, fontSize: '12px', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--bd2)', color: 'var(--ink2)', transition: 'all .2s', ...style }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink2)'; e.currentTarget.style.color = 'var(--ink)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.color = 'var(--ink2)'; }}
  >{children}</button>;
}

function BtnDanger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} style={{ fontFamily: mono, fontSize: '11px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: 'rgba(224,90,90,.1)', border: '1px solid rgba(224,90,90,.2)', color: 'var(--red)', transition: 'all .2s' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,90,90,.2)'; e.currentTarget.style.borderColor = 'rgba(224,90,90,.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(224,90,90,.1)'; e.currentTarget.style.borderColor = 'rgba(224,90,90,.2)'; }}
  >{children}</button>;
}

// LOGIN SCREEN
function LoginScreen({ onLogin, onToast }: { onLogin: (id: string, pass: string) => Promise<boolean>; onToast: (msg: string) => void }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const ok = await onLogin(adminId, password);
    setLoading(false);
    if (!ok) {
      setShake(true);
      onToast('Invalid credentials');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="page-fade" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '2rem' }}>
      <div style={{ ...cardBase, maxWidth: '400px', width: '100%', textAlign: 'center', animation: shake ? 'shake .4s ease' : undefined }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(200,169,110,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 1.25rem' }}>🔐</div>
        <h2 style={{ fontFamily: serif, fontSize: '24px', marginBottom: '.5rem' }}>Admin Access</h2>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '2rem' }}>Enter your credentials to manage the portal</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={labelStyle}>ADMIN ID</label>
            <input value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="Enter admin ID" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <BtnPrimary onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '13px', marginTop: '8px' }}>
            {loading ? 'Signing in…' : 'Sign In to Admin Panel'}
          </BtnPrimary>
          <p style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)', textAlign: 'center' }}>Default: admin / admin123</p>
        </div>
      </div>
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
    </div>
  );
}

export function AdminPanel({ config, onConfigChange, onRefresh, onToast, isLoggedIn, onLogin, onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{ open: boolean; title: string; message: string; action: () => void }>({ open: false, title: '', message: '', action: () => {} });

  if (!isLoggedIn) return <LoginScreen onLogin={onLogin} onToast={onToast} />;

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'branches', label: 'Branches', icon: '🏛️' },
    { id: 'papers', label: 'Papers', icon: '📄' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'syllabus', label: 'Syllabus', icon: '📚' },
    { id: 'pages', label: 'Pages', icon: '📰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const update = (fn: (c: SiteConfig) => SiteConfig) => { onConfigChange(fn({ ...config })); onToast('Changes saved!'); };
  const confirmDelete = (title: string, itemName: string, action: () => void) => {
    setConfirmState({ open: true, title: `Delete ${title}?`, message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`, action });
  };

  return (
    <div className="page-fade">
      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={() => { confirmState.action(); setConfirmState(s => ({ ...s, open: false })); }}
        onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
      />

      <div style={{ borderBottom: '1px solid var(--bd)', background: 'var(--bg2)' }}>
        <div style={{ padding: '2rem clamp(1rem,3vw,2rem) 0', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(200,169,110,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙️</div>
              <div>
                <h1 style={{ fontFamily: serif, fontSize: 'clamp(22px,4vw,28px)' }}>Admin Panel</h1>
                <p style={{ fontSize: '12px', color: 'var(--ink3)', fontFamily: mono }}>Manage everything from one place</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {onRefresh && <BtnSecondary onClick={onRefresh}>↻ Sync</BtnSecondary>}
              <BtnSecondary onClick={onLogout}>Logout</BtnSecondary>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tab selector */}
      <div className="admin-mobile-tabs" style={{ padding: '1rem clamp(1rem,3vw,2rem)', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid var(--bd)' }}>
        <button onClick={() => setMobileTabOpen(!mobileTabOpen)} style={{ fontFamily: mono, fontSize: '12px', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', background: 'var(--bg3)', border: '1px solid var(--bd2)', color: 'var(--ink)', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{tabs.find(t => t.id === tab)?.icon} {tabs.find(t => t.id === tab)?.label}</span>
          <span style={{ fontSize: '10px' }}>{mobileTabOpen ? '▲' : '▼'}</span>
        </button>
        {mobileTabOpen && (
          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setMobileTabOpen(false); }} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '6px', border: 'none', background: tab === t.id ? 'var(--bg3)' : 'transparent', color: tab === t.id ? 'var(--accent)' : 'var(--ink2)', fontFamily: sans, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all .2s' }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="admin-layout" style={{ display: 'grid', maxWidth: '1200px', margin: '0 auto', minHeight: '75vh' }}>
        <div className="admin-sidebar-desktop" style={{ borderRight: '1px solid var(--bd)', padding: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.75rem' }}>MANAGEMENT</div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', textAlign: 'left', padding: '.6rem .75rem', borderRadius: '6px', fontSize: '13px', background: tab === t.id ? 'var(--bg3)' : 'transparent', border: 'none', color: tab === t.id ? 'var(--accent)' : 'var(--ink2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', transition: 'all .2s' }}
              onMouseEnter={e => { if(tab !== t.id) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--ink)'; } }}
              onMouseLeave={e => { if(tab !== t.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink2)'; } }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="admin-slide" style={{ padding: 'clamp(1rem,2vw,2rem)' }}>
          {tab === 'overview' && <OverviewTab config={config} setTab={setTab} />}
          {tab === 'themes' && <ThemesTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'branches' && <BranchesTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'papers' && <PapersTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'notes' && <NotesTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'syllabus' && <SyllabusTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'pages' && <PagesTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
          {tab === 'settings' && <SettingsTab onToast={onToast} onRefresh={onRefresh} />}
        </div>
      </div>

      <style>{`
        .admin-layout { grid-template-columns: 200px 1fr; }
        .admin-mobile-tabs { display: none; }
        .admin-stats-grid { grid-template-columns: repeat(3,1fr); }
        @media (max-width: 768px) { .admin-layout { grid-template-columns: 1fr; } .admin-sidebar-desktop { display: none !important; } .admin-mobile-tabs { display: block !important; } .admin-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .admin-stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

type ConfirmFn = (title: string, item: string, action: () => void) => void;
type UpdateFn = (fn: (c: SiteConfig) => SiteConfig) => void;

function OverviewTab({ config, setTab }: { config: SiteConfig; setTab: (t: AdminTab) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Dashboard</h2>
      <div className="admin-stats-grid" style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
        {[{ n: config.papers.length, l: 'PAPERS' },{ n: config.notes.length, l: 'NOTES' },{ n: config.branches.length, l: 'BRANCHES' },{ n: config.themes.length, l: 'THEMES' },{ n: config.syllabus.length, l: 'SYLLABI' },{ n: config.customPages.length, l: 'CUSTOM PAGES' }].map((s, i) => (
          <HoverCard key={i}>
            <div style={{ fontFamily: serif, fontSize: '28px', color: 'var(--accent)', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1px', marginTop: '.4rem' }}>{s.l}</div>
          </HoverCard>
        ))}
      </div>
      <HoverCard>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <BtnPrimary onClick={() => setTab('papers')}>+ Add Paper</BtnPrimary>
          <BtnPrimary onClick={() => setTab('notes')}>+ Add Note</BtnPrimary>
          <BtnSecondary onClick={() => setTab('branches')}>+ Add Branch</BtnSecondary>
          <BtnSecondary onClick={() => setTab('themes')}>+ Add Theme</BtnSecondary>
          <BtnSecondary onClick={() => setTab('pages')}>+ Add Page</BtnSecondary>
        </div>
      </HoverCard>
    </div>
  );
}

function ThemesTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [label, setLabel] = useState('');
  const [accent, setAccent] = useState('#e06040');
  const [isDark, setIsDark] = useState(true);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!label.trim()) return onToast('Enter a theme name');
    setSaving(true);
    const themeId = 'custom-' + label.toLowerCase().replace(/\s+/g, '-');
    const vars = generateThemeVars(accent, isDark);
    const local: ThemeConfig = { id: themeId, label: label.trim(), preview: accent, isCustom: true, isDark, vars };
    try {
      const created = await api.themes.create({ id: themeId, label: label.trim(), preview: accent, isCustom: true, isDark, vars });
      update(c => ({ ...c, themes: [...c.themes, { ...local, _id: (created as any)._id ?? (created as any).id }] }));
    } catch {
      update(c => ({ ...c, themes: [...c.themes, local] }));
    }
    setSaving(false);
    setLabel('');
    onToast(`Theme "${label.trim()}" created!`);
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Themes</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Create New Theme</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '150px' }}><label style={labelStyle}>THEME NAME</label><input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Ocean Blue" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
            <div style={{ width: '80px' }}><label style={labelStyle}>ACCENT</label><input type="color" value={accent} onChange={e => setAccent(e.target.value)} style={{ ...inputStyle, padding: '4px', height: '38px', cursor: 'pointer' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={labelStyle}>MODE</label>
            <button onClick={() => setIsDark(true)} style={{ fontFamily: mono, fontSize: '11px', padding: '6px 14px', borderWidth: '1px', borderStyle: 'solid', borderColor: isDark ? 'var(--accent)' : 'var(--bd)', borderRadius: '20px', color: isDark ? 'var(--accent)' : 'var(--ink2)', background: isDark ? 'rgba(200,169,110,.08)' : 'transparent', cursor: 'pointer' }}>🌙 Dark</button>
            <button onClick={() => setIsDark(false)} style={{ fontFamily: mono, fontSize: '11px', padding: '6px 14px', borderWidth: '1px', borderStyle: 'solid', borderColor: !isDark ? 'var(--accent)' : 'var(--bd)', borderRadius: '20px', color: !isDark ? 'var(--accent)' : 'var(--ink2)', background: !isDark ? 'rgba(200,169,110,.08)' : 'transparent', cursor: 'pointer' }}>☀️ Light</button>
          </div>
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--bd)' }}>
            <div style={{ background: isDark ? '#0b0c0e' : '#faf8f5', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: accent }} />
              <span style={{ fontFamily: mono, fontSize: '11px', color: isDark ? '#f0ede6' : '#1a1510' }}>Preview: {label || 'New Theme'}</span>
            </div>
            <div style={{ background: isDark ? '#111316' : '#f0ece5', padding: '12px 16px', display: 'flex', gap: '8px' }}>
              <span style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: accent + '22', color: accent }}>Accent</span>
              <span style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: isDark ? '#1c2028' : '#d6d0c5', color: isDark ? '#5c5850' : '#7a756e' }}>Muted</span>
            </div>
          </div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>+ Create Theme</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {config.themes.map((t, i) => (
          <HoverCard key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', flexWrap: 'wrap' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.preview, flexShrink: 0, border: '2px solid var(--bd2)' }} />
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{t.label}</span>
            <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--ink3)' }}>{t.id}</span>
            {t.isCustom && <span style={{ fontFamily: mono, fontSize: '10px', padding: '2px 8px', borderRadius: '3px', background: 'rgba(200,169,110,.1)', color: 'var(--accent)' }}>CUSTOM</span>}
            {(t.isCustom || i >= 4) && (
              <BtnDanger onClick={() => confirmDelete('Theme', t.label, async () => {
                if (t._id) await api.themes.remove(t._id).catch(() => {});
                update(c => ({ ...c, themes: c.themes.filter((_, j) => j !== i) }));
              })}>Delete</BtnDanger>
            )}
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

function BranchesTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('📚');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!code.trim() || !label.trim()) return onToast('Fill all fields');
    setSaving(true);
    const data = { code: code.toUpperCase(), label: label.trim(), icon, dot: 'var(--accent)', paperCount: 0 };
    try {
      const created = await api.branches.create(data);
      update(c => ({ ...c, branches: [...c.branches, { ...data, _id: (created as any)._id ?? (created as any).id }] }));
    } catch {
      update(c => ({ ...c, branches: [...c.branches, data] }));
    }
    setSaving(false);
    setCode(''); setLabel(''); setIcon('📚');
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Branches</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Add New Branch</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ width: '80px' }}><label style={labelStyle}>CODE</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="BT" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <div style={{ flex: 1, minWidth: '150px' }}><label style={labelStyle}>NAME</label><input value={label} onChange={e => setLabel(e.target.value)} placeholder="Biotechnology" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <div style={{ width: '60px' }}><label style={labelStyle}>ICON</label><input value={icon} onChange={e => setIcon(e.target.value)} style={inputStyle} /></div>
          <BtnPrimary onClick={add} disabled={saving}>+ Add</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {config.branches.map((b, i) => (
          <HoverCard key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '20px' }}>{b.icon}</span>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, minWidth: '100px' }}>{b.label}</span>
            <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--ink3)', padding: '3px 8px', background: 'var(--bg3)', borderRadius: '3px' }}>{b.code}</span>
            <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--ink3)' }}>{b.paperCount} papers</span>
            <BtnDanger onClick={() => confirmDelete('Branch', b.label, async () => {
              if (b._id) await api.branches.remove(b._id).catch(() => {});
              update(c => ({ ...c, branches: c.branches.filter((_, j) => j !== i) }));
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

function PapersTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [title, setTitle] = useState(''); const [code, setCode] = useState(''); const [branch, setBranch] = useState('CS'); const [sem, setSem] = useState(4); const [year, setYear] = useState('2024');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim() || !code.trim()) return onToast('Fill all fields');
    setSaving(true);
    const data: Partial<PaperConfig> = { tag: `${branch} · SEM ${sem}`, title: title.trim(), code: code.trim(), year, size: '1.0 MB', branch, semester: sem, color: 'rgba(200,169,110,.12)', textColor: 'var(--accent)' };
    try {
      const created = await api.papers.create(data);
      update(c => ({ ...c, papers: [created, ...c.papers] }));
    } catch {
      update(c => ({ ...c, papers: [{ id: 'p' + Date.now(), ...data } as PaperConfig, ...c.papers] }));
    }
    setSaving(false);
    setTitle(''); setCode('');
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Papers ({config.papers.length})</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Add New Paper</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div className="admin-form-2col" style={{ display: 'grid', gap: '10px' }}>
            <div><label style={labelStyle}>TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Operating Systems" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
            <div><label style={labelStyle}>CODE</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="CS-501" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          </div>
          <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
            <div><label style={labelStyle}>BRANCH</label><select value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle}>{config.branches.map(b => <option key={b.code} value={b.code}>{b.label}</option>)}</select></div>
            <div><label style={labelStyle}>SEMESTER</label><select value={sem} onChange={e => setSem(Number(e.target.value))} style={inputStyle}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}</select></div>
            <div><label style={labelStyle}>YEAR</label><select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>{['2024','2023','2022','2021','2020'].map(y => <option key={y}>{y}</option>)}</select></div>
          </div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>+ Add Paper</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {config.papers.map((p, i) => (
          <HoverCard key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.75rem 1rem', flexWrap: 'wrap' }}>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, minWidth: '120px' }}>{p.title}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg3)', color: 'var(--ink3)' }}>{p.code}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{p.tag} · {p.year}</span>
            <BtnDanger onClick={() => confirmDelete('Paper', p.title, async () => {
              await api.papers.remove(p.id).catch(() => {});
              update(c => ({ ...c, papers: c.papers.filter((_, j) => j !== i) }));
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
      </div>
      <style>{`.admin-form-2col{grid-template-columns:1fr 1fr}.admin-form-3col{grid-template-columns:1fr 1fr 1fr}@media(max-width:480px){.admin-form-2col,.admin-form-3col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function NotesTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [title, setTitle] = useState(''); const [type, setType] = useState('Handwritten'); const [branch, setBranch] = useState('CS · Sem 4'); const [pages, setPages] = useState('30 pages');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim()) return onToast('Enter a title');
    setSaving(true);
    const data: Partial<NoteConfig> = { icon: type==='Slides'?'📊':type==='Typed PDF'?'📄':'📝', title: title.trim(), branch, branchColor: 'rgba(200,169,110,.12)', branchText: 'var(--accent)', type, pages, size: '2.0 MB' };
    try {
      const created = await api.notes.create(data);
      update(c => ({ ...c, notes: [created, ...c.notes] }));
    } catch {
      update(c => ({ ...c, notes: [{ id: 'n'+Date.now(), ...data } as NoteConfig, ...c.notes] }));
    }
    setSaving(false);
    setTitle('');
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Notes ({config.notes.length})</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Add New Note</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div><label style={labelStyle}>TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. OS Complete Notes" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
            <div><label style={labelStyle}>TYPE</label><select value={type} onChange={e => setType(e.target.value)} style={inputStyle}><option>Handwritten</option><option>Typed PDF</option><option>Slides</option></select></div>
            <div><label style={labelStyle}>BRANCH</label><input value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>PAGES</label><input value={pages} onChange={e => setPages(e.target.value)} style={inputStyle} /></div>
          </div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>+ Add Note</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {config.notes.map((n, i) => (
          <HoverCard key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.75rem 1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px' }}>{n.icon}</span>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, minWidth: '120px' }}>{n.title}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{n.type} · {n.branch}</span>
            <BtnDanger onClick={() => confirmDelete('Note', n.title, async () => {
              await api.notes.remove(n.id).catch(() => {});
              update(c => ({ ...c, notes: c.notes.filter((_, j) => j !== i) }));
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
      </div>
      <style>{`.admin-form-3col{grid-template-columns:1fr 1fr 1fr}@media(max-width:480px){.admin-form-3col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function SyllabusTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [selBranch, setSelBranch] = useState(0); const [newSubName, setNewSubName] = useState(''); const [newSubCode, setNewSubCode] = useState(''); const [newSubSem, setNewSubSem] = useState(0);
  const data = config.syllabus[selBranch];
  const addSubject = () => {
    if (!newSubName.trim() || !newSubCode.trim()) return onToast('Fill subject name and code');
    update(c => { const syl = [...c.syllabus]; const br = { ...syl[selBranch] }; const sems = [...br.semesters]; const sm = { ...sems[newSubSem] }; sm.subjects = [...sm.subjects, { name: newSubName.trim(), code: newSubCode.trim() }]; sems[newSubSem] = sm; br.semesters = sems; syl[selBranch] = br; return { ...c, syllabus: syl }; });
    setNewSubName(''); setNewSubCode('');
  };
  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Syllabus Management</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {config.syllabus.map((s, i) => (
          <button key={s.code} onClick={() => setSelBranch(i)} style={{ fontFamily: mono, fontSize: '11px', padding: '6px 14px', borderWidth: '1px', borderStyle: 'solid', borderColor: selBranch === i ? 'var(--accent)' : 'var(--bd)', borderRadius: '20px', color: selBranch === i ? 'var(--accent)' : 'var(--ink2)', background: selBranch === i ? 'rgba(200,169,110,.08)' : 'transparent', cursor: 'pointer', transition: 'all .2s' }}>{s.code}</button>
        ))}
      </div>
      {data && (<>
        <HoverCard style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Add Subject to {data.name}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ width: '100px' }}><label style={labelStyle}>SEMESTER</label><select value={newSubSem} onChange={e => setNewSubSem(Number(e.target.value))} style={inputStyle}>{data.semesters.map((s, i) => <option key={i} value={i}>{s.num}</option>)}</select></div>
            <div style={{ flex: 1, minWidth: '140px' }}><label style={labelStyle}>SUBJECT</label><input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Subject name" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
            <div style={{ width: '100px' }}><label style={labelStyle}>CODE</label><input value={newSubCode} onChange={e => setNewSubCode(e.target.value)} placeholder="KCS-701" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
            <BtnPrimary onClick={addSubject}>+ Add</BtnPrimary>
          </div>
        </HoverCard>
        {data.semesters.map((sem, si) => (
          <HoverCard key={si} style={{ marginBottom: '8px', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
              <span style={{ fontFamily: mono, fontSize: '11px', color: 'var(--accent)' }}>{sem.num}</span>
              <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{sem.subjects.length} subjects</span>
            </div>
            {sem.subjects.map((s, sj) => (
              <div key={sj} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.3rem 0', fontSize: '13px', color: 'var(--ink2)', borderTop: sj > 0 ? '1px solid var(--bd)' : 'none', gap: '8px' }}>
                <span>{s.name}</span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{s.code}</span>
                  <button onClick={() => confirmDelete('Subject', s.name, () => update(c => { const syl = [...c.syllabus]; const br = { ...syl[selBranch] }; const sems = [...br.semesters]; const sm = { ...sems[si] }; sm.subjects = sm.subjects.filter((_, k) => k !== sj); sems[si] = sm; br.semesters = sems; syl[selBranch] = br; return { ...c, syllabus: syl }; }))} style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', background: 'rgba(224,90,90,.1)', border: '1px solid rgba(224,90,90,.2)', color: 'var(--red)', transition: 'all .2s' }}>×</button>
                </div>
              </div>
            ))}
          </HoverCard>
        ))}
      </>)}
    </div>
  );
}

function PagesTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [title, setTitle] = useState(''); const [navLabel, setNavLabel] = useState(''); const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim() || !navLabel.trim()) return onToast('Fill title and nav label');
    setSaving(true);
    const data = { title: title.trim(), navLabel: navLabel.trim(), content: content.trim() || 'Coming soon...', visible: true };
    try {
      const created = await api.pages.create(data);
      update(c => ({ ...c, customPages: [...c.customPages, created] }));
    } catch {
      update(c => ({ ...c, customPages: [...c.customPages, { id: 'pg-' + Date.now(), ...data } as CustomPageConfig] }));
    }
    setSaving(false);
    setTitle(''); setNavLabel(''); setContent('');
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Custom Pages</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Add New Page</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div className="admin-form-2col" style={{ display: 'grid', gap: '10px' }}>
            <div><label style={labelStyle}>PAGE TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. FAQ" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
            <div><label style={labelStyle}>NAV LABEL</label><input value={navLabel} onChange={e => setNavLabel(e.target.value)} placeholder="e.g. FAQ" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          </div>
          <div><label style={labelStyle}>CONTENT</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your page content here..." rows={6} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>+ Add Page</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {config.customPages.map((p, i) => (
          <HoverCard key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px' }}>📰</span>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.title}</div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)', marginTop: '2px' }}>Nav: "{p.navLabel}" · {p.visible ? '✅ Visible' : '🚫 Hidden'}</div>
            </div>
            <BtnSecondary onClick={async () => {
              const updated = { ...p, visible: !p.visible };
              await api.pages.update(p.id, { visible: !p.visible }).catch(() => {});
              update(c => ({ ...c, customPages: c.customPages.map((pg, j) => j === i ? updated : pg) }));
            }}>{p.visible ? 'Hide' : 'Show'}</BtnSecondary>
            <BtnDanger onClick={() => confirmDelete('Page', p.title, async () => {
              await api.pages.remove(p.id).catch(() => {});
              update(c => ({ ...c, customPages: c.customPages.filter((_, j) => j !== i) }));
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
        {config.customPages.length === 0 && <HoverCard style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink3)', fontFamily: mono, fontSize: '13px' }}>No custom pages yet. Add one above.</HoverCard>}
      </div>
      <style>{`.admin-form-2col{grid-template-columns:1fr 1fr}@media(max-width:480px){.admin-form-2col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function SettingsTab({ onToast, onRefresh }: { onToast: (m: string) => void; onRefresh?: () => void }) {
  const [newPass, setNewPass] = useState('');
  const [saving, setSaving] = useState(false);

  const changePass = async () => {
    if (newPass.length < 6) return onToast('Password must be at least 6 characters');
    setSaving(true);
    try {
      await api.auth.changePassword(newPass);
      onToast('Password changed successfully!');
      setNewPass('');
    } catch (err: any) {
      onToast(err.message || 'Failed to change password');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Settings</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Change Admin Password</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}><label style={labelStyle}>NEW PASSWORD</label><input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Enter new password (min 6 chars)" style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <BtnPrimary onClick={changePass} disabled={saving}>{saving ? 'Saving…' : 'Update Password'}</BtnPrimary>
        </div>
      </HoverCard>
      <HoverCard>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Sync from Server</h3>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '1rem' }}>Reload all data from the backend to get the latest state.</p>
        <BtnSecondary onClick={() => { if (onRefresh) { onRefresh(); onToast('Synced from server!'); } }}>↻ Reload All Data</BtnSecondary>
      </HoverCard>
    </div>
  );
}
