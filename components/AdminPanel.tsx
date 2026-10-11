'use client';
import { useState, useEffect } from 'react';
import { SiteConfig, ThemeConfig, PaperConfig, NoteConfig, SubmissionConfig } from '@/lib/types';
import { generateThemeVars } from '@/lib/store';
import { api, fileHref } from '@/lib/api';
import { setToken } from '@/lib/auth';

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));
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

type AdminTab = 'overview' | 'themes' | 'branches' | 'papers' | 'notes' | 'submissions' | 'syllabus' | 'pages' | 'settings';

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
            <input value={adminId} onChange={e => setAdminId(e.target.value)} placeholder="Enter admin ID" autoComplete="username" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <BtnPrimary onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '13px', marginTop: '8px' }}>
            {loading ? 'Signing in…' : 'Sign In to Admin Panel'}
          </BtnPrimary>
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
    { id: 'submissions', label: 'Submissions', icon: '📥' },
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
          {tab === 'submissions' && <SubmissionsTab config={config} update={update} confirmDelete={confirmDelete} onToast={onToast} />}
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
          <BtnSecondary onClick={() => setTab('submissions')}>📥 Review Submissions</BtnSecondary>
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
      const created = await api.themes.create({ themeId, label: label.trim(), preview: accent, isDark, vars });
      update(c => ({ ...c, themes: [...c.themes, { ...local, _id: created.id }] }));
      setLabel('');
      onToast(`Theme "${label.trim()}" created!`);
    } catch (e) {
      onToast(`Could not create theme: ${errMsg(e)}`);
    }
    setSaving(false);
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
                try {
                  if (t._id) await api.themes.remove(t._id);
                  update(c => ({ ...c, themes: c.themes.filter((_, j) => j !== i) }));
                } catch (e) { onToast(`Could not delete theme: ${errMsg(e)}`); }
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
      update(c => ({ ...c, branches: [...c.branches, { ...data, _id: created.id }] }));
      setCode(''); setLabel(''); setIcon('📚');
    } catch (e) {
      onToast(`Could not add branch: ${errMsg(e)}`);
    }
    setSaving(false);
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
              try {
                if (b._id) await api.branches.remove(b._id);
                update(c => ({ ...c, branches: c.branches.filter((_, j) => j !== i) }));
              } catch (e) { onToast(`Could not delete branch: ${errMsg(e)}`); }
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

function PapersTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState(''); const [code, setCode] = useState(''); const [branch, setBranch] = useState('CS'); const [sem, setSem] = useState(4); const [year, setYear] = useState('2024');
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim() || !code.trim()) return onToast('Fill all fields');
    setSaving(true);
    try {
      const uploaded = file ? await api.uploads.uploadFile(file) : null;
      const created = await api.papers.create({
        title: title.trim(), code: code.trim(), year, branch, semester: sem,
        color: 'rgba(200,169,110,.12)', textColor: 'var(--accent)',
        ...(uploaded && { fileUrl: uploaded.url, size: uploaded.sizeLabel }),
      });
      update(c => ({ ...c, papers: [created, ...c.papers] }));
      setTitle(''); setCode(''); setFile(null); setFileKey(k => k + 1);
      onToast('Paper added');
    } catch (e) {
      onToast(`Could not add paper: ${errMsg(e)}`);
    }
    setSaving(false);
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
            <div><label style={labelStyle}>YEAR</label><select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>{['2026','2025','2024','2023','2022','2021','2020'].map(y => <option key={y}>{y}</option>)}</select></div>
          </div>
          <div><label style={labelStyle}>FILE (PDF / PPT, OPTIONAL)</label><input key={fileKey} type="file" accept=".pdf,.ppt,.pptx" onChange={e => setFile(e.target.files?.[0] ?? null)} style={inputStyle} /></div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving…' : '+ Add Paper'}</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {config.papers.map((p, i) => editingId === p.id ? (
          <PaperEditForm key={p.id} paper={p} config={config} onToast={onToast} onCancel={() => setEditingId(null)}
            onSaved={updated => { update(c => ({ ...c, papers: c.papers.map(x => x.id === updated.id ? updated : x) })); setEditingId(null); }} />
        ) : (
          <HoverCard key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.75rem 1rem', flexWrap: 'wrap' }}>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, minWidth: '120px' }}>{p.title}{p.fileUrl && <span title="File attached"> 📎</span>}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg3)', color: 'var(--ink3)' }}>{p.code}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{p.tag} · {p.year}</span>
            <BtnSecondary onClick={() => setEditingId(p.id)} style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</BtnSecondary>
            <BtnDanger onClick={() => confirmDelete('Paper', p.title, async () => {
              try {
                await api.papers.remove(p.id);
                update(c => ({ ...c, papers: c.papers.filter((_, j) => j !== i) }));
              } catch (e) { onToast(`Could not delete paper: ${errMsg(e)}`); }
            })}>Delete</BtnDanger>
          </HoverCard>
        ))}
      </div>
      <style>{`.admin-form-2col{grid-template-columns:1fr 1fr}.admin-form-3col{grid-template-columns:1fr 1fr 1fr}@media(max-width:480px){.admin-form-2col,.admin-form-3col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function NotesTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState(''); const [type, setType] = useState('Handwritten'); const [branch, setBranch] = useState('CS · Sem 4'); const [pages, setPages] = useState('30 pages');
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (!title.trim()) return onToast('Enter a title');
    setSaving(true);
    try {
      const uploaded = file ? await api.uploads.uploadFile(file) : null;
      const created = await api.notes.create({
        title: title.trim(), branch, type, pages,
        branchColor: 'rgba(200,169,110,.12)', branchText: 'var(--accent)',
        ...(uploaded && { fileUrl: uploaded.url, size: uploaded.sizeLabel }),
      });
      update(c => ({ ...c, notes: [created, ...c.notes] }));
      setTitle(''); setFile(null); setFileKey(k => k + 1);
      onToast('Note added');
    } catch (e) {
      onToast(`Could not add note: ${errMsg(e)}`);
    }
    setSaving(false);
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
          <div><label style={labelStyle}>FILE (PDF / PPT, OPTIONAL)</label><input key={fileKey} type="file" accept=".pdf,.ppt,.pptx" onChange={e => setFile(e.target.files?.[0] ?? null)} style={inputStyle} /></div>
          <BtnPrimary onClick={add} disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving…' : '+ Add Note'}</BtnPrimary>
        </div>
      </HoverCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {config.notes.map((n, i) => editingId === n.id ? (
          <NoteEditForm key={n.id} note={n} onToast={onToast} onCancel={() => setEditingId(null)}
            onSaved={updated => { update(c => ({ ...c, notes: c.notes.map(x => x.id === updated.id ? updated : x) })); setEditingId(null); }} />
        ) : (
          <HoverCard key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '.75rem 1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px' }}>{n.icon}</span>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, minWidth: '120px' }}>{n.title}{n.fileUrl && <span title="File attached"> 📎</span>}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', color: 'var(--ink3)' }}>{n.type} · {n.branch}</span>
            <BtnSecondary onClick={() => setEditingId(n.id)} style={{ padding: '6px 12px', fontSize: '11px' }}>Edit</BtnSecondary>
            <BtnDanger onClick={() => confirmDelete('Note', n.title, async () => {
              try {
                await api.notes.remove(n.id);
                update(c => ({ ...c, notes: c.notes.filter((_, j) => j !== i) }));
              } catch (e) { onToast(`Could not delete note: ${errMsg(e)}`); }
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
  const addSubject = async () => {
    if (!newSubName.trim() || !newSubCode.trim()) return onToast('Fill subject name and code');
    const semId = data?.semesters[newSubSem]?._id;
    if (!semId) return onToast('Syllabus is not loaded from the backend — cannot save');
    try {
      const created = await api.syllabus.addSubject(semId, newSubName.trim(), newSubCode.trim());
      update(c => { const syl = [...c.syllabus]; const br = { ...syl[selBranch] }; const sems = [...br.semesters]; const sm = { ...sems[newSubSem] }; sm.subjects = [...sm.subjects, { _id: created.id, name: created.name, code: created.code }]; sems[newSubSem] = sm; br.semesters = sems; syl[selBranch] = br; return { ...c, syllabus: syl }; });
      setNewSubName(''); setNewSubCode('');
    } catch (e) {
      onToast(`Could not add subject: ${errMsg(e)}`);
    }
  };
  const removeSubject = async (si: number, sj: number) => {
    const subId = data?.semesters[si]?.subjects[sj]?._id;
    try {
      if (subId) await api.syllabus.removeSubject(subId);
      update(c => { const syl = [...c.syllabus]; const br = { ...syl[selBranch] }; const sems = [...br.semesters]; const sm = { ...sems[si] }; sm.subjects = sm.subjects.filter((_, k) => k !== sj); sems[si] = sm; br.semesters = sems; syl[selBranch] = br; return { ...c, syllabus: syl }; });
    } catch (e) {
      onToast(`Could not delete subject: ${errMsg(e)}`);
    }
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
                  <button onClick={() => confirmDelete('Subject', s.name, () => removeSubject(si, sj))} style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', background: 'rgba(224,90,90,.1)', border: '1px solid rgba(224,90,90,.2)', color: 'var(--red)', transition: 'all .2s' }}>×</button>
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
      setTitle(''); setNavLabel(''); setContent('');
    } catch (e) {
      onToast(`Could not create page: ${errMsg(e)}`);
    }
    setSaving(false);
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
              try {
                await api.pages.update(p.id, { visible: !p.visible });
                update(c => ({ ...c, customPages: c.customPages.map((pg, j) => j === i ? updated : pg) }));
              } catch (e) { onToast(`Could not update page: ${errMsg(e)}`); }
            }}>{p.visible ? 'Hide' : 'Show'}</BtnSecondary>
            <BtnDanger onClick={() => confirmDelete('Page', p.title, async () => {
              try {
                await api.pages.remove(p.id);
                update(c => ({ ...c, customPages: c.customPages.filter((_, j) => j !== i) }));
              } catch (e) { onToast(`Could not delete page: ${errMsg(e)}`); }
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
  const [currentPass, setCurrentPass] = useState('');
  const [newId, setNewId] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const id = newId.trim();
    if (!currentPass) return onToast('Enter your current password to confirm');
    if (!id && !newPass) return onToast('Enter a new admin ID and/or a new password');
    if (id && (id.length < 3 || /\s/.test(id))) return onToast('Admin ID must be at least 3 characters with no spaces');
    if (newPass && newPass.length < 8) return onToast('New password must be at least 8 characters');
    if (newPass !== confirmPass) return onToast('New passwords do not match');
    setSaving(true);
    try {
      const { access_token } = await api.auth.updateCredentials({
        currentPassword: currentPass,
        ...(id && { newAdminId: id }),
        ...(newPass && { newPassword: newPass }),
      });
      setToken(access_token); // older sessions are revoked server-side; keep this one signed in
      setCurrentPass(''); setNewId(''); setNewPass(''); setConfirmPass('');
      onToast('Credentials updated. Other sessions have been signed out.');
    } catch (e) {
      onToast(`Could not update credentials: ${errMsg(e)}`);
    }
    setSaving(false);
  };

  const field = (label: string, value: string, set: (v: string) => void, type: string, autoComplete: string, placeholder: string) => (
    <div><label style={labelStyle}>{label}</label><input type={type} value={value} onChange={e => set(e.target.value)} autoComplete={autoComplete} placeholder={placeholder} style={inputStyle} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
  );

  return (
    <div>
      <h2 style={{ fontFamily: serif, fontSize: '22px', marginBottom: '1.5rem' }}>Settings</h2>
      <HoverCard style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '.4rem' }}>Admin Credentials</h3>
        <p style={{ fontSize: '12px', color: 'var(--ink3)', marginBottom: '1rem' }}>Change the admin ID, the password, or both. Leave a field empty to keep it unchanged. Other signed-in sessions will be logged out.</p>
        <form onSubmit={e => { e.preventDefault(); save(); }} style={{ display: 'grid', gap: '10px' }}>
          {field('CURRENT PASSWORD *', currentPass, setCurrentPass, 'password', 'current-password', 'Required to confirm changes')}
          <div className="admin-form-2col" style={{ display: 'grid', gap: '10px' }}>
            {field('NEW ADMIN ID', newId, setNewId, 'text', 'username', 'Leave empty to keep current')}
            <div />
            {field('NEW PASSWORD', newPass, setNewPass, 'password', 'new-password', 'Min 8 characters')}
            {field('CONFIRM NEW PASSWORD', confirmPass, setConfirmPass, 'password', 'new-password', 'Repeat new password')}
          </div>
          <BtnPrimary disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving…' : 'Update Credentials'}</BtnPrimary>
        </form>
      </HoverCard>
      <HoverCard>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '1rem' }}>Sync from Server</h3>
        <p style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '1rem' }}>Reload all data from the backend to get the latest state.</p>
        <BtnSecondary onClick={() => { if (onRefresh) { onRefresh(); onToast('Synced from server!'); } }}>↻ Reload All Data</BtnSecondary>
      </HoverCard>
      <style>{`.admin-form-2col{grid-template-columns:1fr 1fr}@media(max-width:480px){.admin-form-2col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

// ---------- Edit forms ----------

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];
const NOTE_TYPES = ['Handwritten', 'Typed PDF', 'Slides'];
const focusOn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = 'var(--accent)');
const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = 'var(--bd2)');

function FileField({ current, onPick, label = 'REPLACE FILE (OPTIONAL)' }: { current?: string | null; onPick: (f: File | null) => void; label?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {current && <div style={{ fontSize: '12px', marginBottom: '6px' }}><a href={fileHref(current)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>📎 Current file</a></div>}
      <input type="file" accept=".pdf,.ppt,.pptx" onChange={e => onPick(e.target.files?.[0] ?? null)} style={inputStyle} />
    </div>
  );
}

function EditActions({ saving, onSave, onCancel }: { saving: boolean; onSave: () => void; onCancel: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <BtnPrimary onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</BtnPrimary>
      <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
    </div>
  );
}

function PaperEditForm({ paper, config, onSaved, onCancel, onToast }: { paper: PaperConfig; config: SiteConfig; onSaved: (p: PaperConfig) => void; onCancel: () => void; onToast: (m: string) => void }) {
  const [title, setTitle] = useState(paper.title);
  const [code, setCode] = useState(paper.code);
  const [branch, setBranch] = useState(paper.branch);
  const [sem, setSem] = useState(paper.semester);
  const [year, setYear] = useState(paper.year);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const years = YEARS.includes(paper.year) ? YEARS : [paper.year, ...YEARS];
  const branchOptions = config.branches.some(b => b.code === paper.branch) ? config.branches : [{ code: paper.branch, label: paper.branch }, ...config.branches];

  const save = async () => {
    if (!title.trim() || !code.trim()) return onToast('Title and code are required');
    setSaving(true);
    try {
      const uploaded = file ? await api.uploads.uploadFile(file) : null;
      const updated = await api.papers.update(paper.id, {
        title: title.trim(), code: code.trim(), branch, semester: sem, year,
        ...(uploaded && { fileUrl: uploaded.url, size: uploaded.sizeLabel }),
      });
      onSaved(updated);
    } catch (e) {
      onToast(`Could not update paper: ${errMsg(e)}`);
      setSaving(false);
    }
  };

  return (
    <HoverCard style={{ padding: '1rem', display: 'grid', gap: '10px', border: '1px solid var(--accent)' }}>
      <div className="admin-form-2col" style={{ display: 'grid', gap: '10px' }}>
        <div><label style={labelStyle}>TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
        <div><label style={labelStyle}>CODE</label><input value={code} onChange={e => setCode(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
      </div>
      <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
        <div><label style={labelStyle}>BRANCH</label><select value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle}>{branchOptions.map(b => <option key={b.code} value={b.code}>{b.label}</option>)}</select></div>
        <div><label style={labelStyle}>SEMESTER</label><select value={sem} onChange={e => setSem(Number(e.target.value))} style={inputStyle}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Sem {n}</option>)}</select></div>
        <div><label style={labelStyle}>YEAR</label><select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>{years.map(y => <option key={y}>{y}</option>)}</select></div>
      </div>
      <FileField current={paper.fileUrl} onPick={setFile} />
      <EditActions saving={saving} onSave={save} onCancel={onCancel} />
    </HoverCard>
  );
}

function NoteEditForm({ note, onSaved, onCancel, onToast }: { note: NoteConfig; onSaved: (n: NoteConfig) => void; onCancel: () => void; onToast: (m: string) => void }) {
  const [title, setTitle] = useState(note.title);
  const [type, setType] = useState(note.type);
  const [branch, setBranch] = useState(note.branch);
  const [pages, setPages] = useState(note.pages);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) return onToast('Title is required');
    setSaving(true);
    try {
      const uploaded = file ? await api.uploads.uploadFile(file) : null;
      const updated = await api.notes.update(note.id, {
        title: title.trim(), type, branch: branch.trim(), pages: pages.trim(),
        ...(uploaded && { fileUrl: uploaded.url, size: uploaded.sizeLabel }),
      });
      onSaved(updated);
    } catch (e) {
      onToast(`Could not update note: ${errMsg(e)}`);
      setSaving(false);
    }
  };

  return (
    <HoverCard style={{ padding: '1rem', display: 'grid', gap: '10px', border: '1px solid var(--accent)' }}>
      <div><label style={labelStyle}>TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
      <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
        <div><label style={labelStyle}>TYPE</label><select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>{NOTE_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
        <div><label style={labelStyle}>BRANCH</label><input value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
        <div><label style={labelStyle}>PAGES</label><input value={pages} onChange={e => setPages(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
      </div>
      <FileField current={note.fileUrl} onPick={setFile} />
      <EditActions saving={saving} onSave={save} onCancel={onCancel} />
    </HoverCard>
  );
}

// ---------- Submissions (community upload review queue) ----------

type SubmissionFilter = 'pending' | 'approved' | 'rejected' | 'all';

const toNoteType = (t: string) => (/slide|ppt/i.test(t) ? 'Slides' : /typed/i.test(t) ? 'Typed PDF' : 'Handwritten');
const toSemester = (s: string) => Math.min(8, Math.max(1, parseInt(s.match(/\d+/)?.[0] ?? '1', 10)));

function SubmissionsTab({ config, update, confirmDelete, onToast }: { config: SiteConfig; update: UpdateFn; confirmDelete: ConfirmFn; onToast: (m: string) => void }) {
  const [filter, setFilter] = useState<SubmissionFilter>('pending');
  const [items, setItems] = useState<SubmissionConfig[] | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    api.submissions.list(filter)
      .then(r => { if (alive) setItems(r); })
      .catch(e => { if (alive) { setItems([]); onToast(`Could not load submissions: ${errMsg(e)}`); } });
    return () => { alive = false; };
  }, [filter, reload, onToast]);

  const changeFilter = (f: SubmissionFilter) => { setItems(null); setFilter(f); };
  const replace = (s: SubmissionConfig) =>
    setItems(list => (list ?? []).flatMap(x => x.id !== s.id ? [x] : filter === 'all' || filter === s.status ? [s] : []));
  const drop = (id: string) => setItems(list => (list ?? []).filter(x => x.id !== id));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: serif, fontSize: '22px' }}>Community Submissions</h2>
        <BtnSecondary onClick={() => { setItems(null); setReload(r => r + 1); }}>↻ Refresh</BtnSecondary>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['pending', 'approved', 'rejected', 'all'] as SubmissionFilter[]).map(f => (
          <button key={f} onClick={() => changeFilter(f)} style={{ fontFamily: mono, fontSize: '11px', padding: '6px 14px', borderWidth: '1px', borderStyle: 'solid', borderColor: filter === f ? 'var(--accent)' : 'var(--bd)', borderRadius: '20px', color: filter === f ? 'var(--accent)' : 'var(--ink2)', background: filter === f ? 'rgba(200,169,110,.08)' : 'transparent', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>
      {items === null && <p style={{ fontFamily: mono, fontSize: '12px', color: 'var(--ink3)' }}>Loading…</p>}
      {items?.length === 0 && <HoverCard style={{ textAlign: 'center', color: 'var(--ink3)', fontFamily: mono, fontSize: '13px' }}>No {filter === 'all' ? '' : filter} submissions.</HoverCard>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items?.map(s => (
          <SubmissionCard key={s.id} s={s} config={config} onToast={onToast}
            onApproved={(sub, kind, item) => {
              update(c => kind === 'paper' ? { ...c, papers: [item as PaperConfig, ...c.papers] } : { ...c, notes: [item as NoteConfig, ...c.notes] });
              replace(sub);
            }}
            onReject={() => confirmDelete('Submission', s.originalName, async () => {
              try { replace(await api.submissions.reject(s.id)); onToast('Submission rejected and file deleted'); }
              catch (e) { onToast(`Could not reject: ${errMsg(e)}`); }
            })}
            onRemove={() => confirmDelete('Submission record', s.originalName, async () => {
              try { await api.submissions.remove(s.id); drop(s.id); }
              catch (e) { onToast(`Could not delete: ${errMsg(e)}`); }
            })}
          />
        ))}
      </div>
      <style>{`.admin-form-2col{grid-template-columns:1fr 1fr}.admin-form-3col{grid-template-columns:1fr 1fr 1fr}@media(max-width:480px){.admin-form-2col,.admin-form-3col{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function SubmissionCard({ s, config, onToast, onApproved, onReject, onRemove }: {
  s: SubmissionConfig; config: SiteConfig; onToast: (m: string) => void;
  onApproved: (s: SubmissionConfig, kind: 'paper' | 'note', item: PaperConfig | NoteConfig) => void;
  onReject: () => void; onRemove: () => void;
}) {
  const defaultBranch = config.branches.find(b => b.label === s.branch || b.code === s.branch)?.code ?? config.branches[0]?.code ?? 'CS';
  const sem0 = toSemester(s.semester);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<'paper' | 'note'>(/paper|quantum/i.test(s.type) ? 'paper' : 'note');
  const [title, setTitle] = useState(s.subject);
  const [code, setCode] = useState(s.code ?? '');
  const [branch, setBranch] = useState(defaultBranch);
  const [sem, setSem] = useState(sem0);
  const [year, setYear] = useState(s.year || YEARS[0]);
  const [noteType, setNoteType] = useState(toNoteType(s.type));
  const [noteBranch, setNoteBranch] = useState(`${defaultBranch} · Sem ${sem0}`);
  const [pages, setPages] = useState('');
  const [saving, setSaving] = useState(false);
  const years = YEARS.includes(year) ? YEARS : [year, ...YEARS];

  const approve = async () => {
    if (!title.trim()) return onToast('Title is required');
    if (kind === 'paper' && !code.trim()) return onToast('Subject code is required for a paper');
    setSaving(true);
    try {
      const res = await api.submissions.approve(s.id, kind === 'paper'
        ? { kind, title: title.trim(), branch, code: code.trim(), semester: sem, year }
        : { kind, title: title.trim(), branch: noteBranch.trim(), noteType, ...(pages.trim() && { pages: pages.trim() }) });
      onApproved(res.submission, kind, res.item);
      onToast(`Published as a ${kind}`);
    } catch (e) {
      onToast(`Could not approve: ${errMsg(e)}`);
      setSaving(false);
    }
  };

  const statusColor = s.status === 'pending' ? 'var(--accent)' : s.status === 'approved' ? 'var(--green)' : 'var(--red)';
  const chip = (t: string) => <span key={t} style={{ fontFamily: mono, fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--ink3)' }}>{t}</span>;

  return (
    <HoverCard style={{ padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{s.subject}</span>
            <span style={{ fontFamily: mono, fontSize: '10px', padding: '2px 8px', borderRadius: '3px', color: statusColor, borderWidth: '1px', borderStyle: 'solid', borderColor: statusColor, textTransform: 'uppercase' }}>{s.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            {[s.type, s.branch, s.semester, s.year, s.code].filter((x): x is string => !!x).map(chip)}
          </div>
          <div style={{ fontFamily: mono, fontSize: '11px', color: 'var(--ink3)' }}>
            {s.status !== 'rejected'
              ? <a href={fileHref(s.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>📎 {s.originalName}</a>
              : <span>🗑 {s.originalName} (file deleted)</span>}
            {' · '}{s.sizeLabel}{' · '}{new Date(s.createdAt).toLocaleString()}
            {s.resultKind && <> · published as {s.resultKind}</>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {s.status === 'pending' && <BtnPrimary onClick={() => setOpen(o => !o)} style={{ padding: '6px 12px', fontSize: '11px' }}>{open ? 'Close' : 'Review & Approve'}</BtnPrimary>}
          {s.status === 'pending' && <BtnDanger onClick={onReject}>Reject</BtnDanger>}
          {s.status !== 'pending' && <BtnDanger onClick={onRemove}>Delete record</BtnDanger>}
        </div>
      </div>

      {open && s.status === 'pending' && (
        <div style={{ display: 'grid', gap: '10px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--bd)' }}>
          <div className="admin-form-2col" style={{ display: 'grid', gap: '10px' }}>
            <div><label style={labelStyle}>PUBLISH AS</label><select value={kind} onChange={e => setKind(e.target.value as 'paper' | 'note')} style={inputStyle}><option value="paper">Quantum paper</option><option value="note">Note</option></select></div>
            <div><label style={labelStyle}>TITLE</label><input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
          </div>
          {kind === 'paper' ? (
            <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
              <div><label style={labelStyle}>CODE</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="KCS-501" style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
              <div><label style={labelStyle}>BRANCH</label><select value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle}>{config.branches.map(b => <option key={b.code} value={b.code}>{b.label}</option>)}</select></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={labelStyle}>SEM</label><select value={sem} onChange={e => setSem(Number(e.target.value))} style={inputStyle}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <div><label style={labelStyle}>YEAR</label><select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>{years.map(y => <option key={y}>{y}</option>)}</select></div>
              </div>
            </div>
          ) : (
            <div className="admin-form-3col" style={{ display: 'grid', gap: '10px' }}>
              <div><label style={labelStyle}>TYPE</label><select value={noteType} onChange={e => setNoteType(e.target.value)} style={inputStyle}>{NOTE_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              <div><label style={labelStyle}>BRANCH LABEL</label><input value={noteBranch} onChange={e => setNoteBranch(e.target.value)} style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
              <div><label style={labelStyle}>PAGES</label><input value={pages} onChange={e => setPages(e.target.value)} placeholder="e.g. 40 pages" style={inputStyle} onFocus={focusOn} onBlur={focusOff} /></div>
            </div>
          )}
          <div><BtnPrimary onClick={approve} disabled={saving}>{saving ? 'Publishing…' : `✓ Approve & publish as ${kind}`}</BtnPrimary></div>
        </div>
      )}
    </HoverCard>
  );
}
