'use client';
import { useState } from 'react';
import { Page, ThemeConfig } from '@/lib/types';
import { HoverNavLink } from './Hover';

interface TopbarProps { activePage: Page; onNav: (page: Page) => void; theme: string; themes: ThemeConfig[]; onThemeChange: (theme: string) => void; onToast: (msg: string) => void; }

export function Topbar({ activePage, onNav, theme, themes, onThemeChange, onToast }: TopbarProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: { id: Page; label: string }[] = [{ id: 'home', label: 'Home' },{ id: 'quantums', label: 'Quantums' },{ id: 'notes', label: 'Notes' },{ id: 'syllabus', label: 'Syllabus' },{ id: 'about', label: 'About' }];
  const handleNav = (page: Page) => { onNav(page); setMobileOpen(false); };

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--topbar-bg)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--bd)', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div onClick={() => handleNav('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="var(--bg)"><path d="M10 2L2 7v6l8 5 8-5V7L10 2zm0 2.5L16 8l-6 3.75L4 8l6-3.5zM3.5 9.25L9 12.5V17L3.5 13.75V9.25zm7 3.25l5.5-3.25v4.5L10.5 17v-4.5z" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', letterSpacing: '-0.3px', color: 'var(--ink)' }}>QuantumVault</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--accent)', letterSpacing: '1.5px', marginTop: '-2px' }}>AKTU PORTAL</div>
          </div>
        </div>

        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.map(l => <HoverNavLink key={l.id} active={activePage === l.id} onClick={() => handleNav(l.id)}>{l.label}</HoverNavLink>)}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ThemeDropdown themes={themes} theme={theme} themeOpen={themeOpen} setThemeOpen={(v) => { setThemeOpen(v); setMobileOpen(false); }} onThemeChange={onThemeChange} />
          <NavBtn className="desktop-nav" onClick={() => handleNav('upload')}>Upload</NavBtn>
          <NavBtn className="desktop-nav" onClick={() => handleNav('admin')}>Admin</NavBtn>
          <AccentBtn className="desktop-nav" onClick={() => onToast('Sign in coming soon!')}>Sign In</AccentBtn>
          <button className="mobile-only" onClick={() => { setMobileOpen(!mobileOpen); setThemeOpen(false); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ width: '20px', height: '2px', background: 'var(--ink)', borderRadius: '1px', transition: 'all .2s', transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ width: '20px', height: '2px', background: 'var(--ink)', borderRadius: '1px', transition: 'all .2s', opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ width: '20px', height: '2px', background: 'var(--ink)', borderRadius: '1px', transition: 'all .2s', transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu-open" style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, zIndex: 99, background: 'var(--bg)', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(l => <MobileNavItem key={l.id} active={activePage === l.id} onClick={() => handleNav(l.id)}>{l.label}</MobileNavItem>)}
            <div style={{ height: '1px', background: 'var(--bd)', margin: '8px 0' }} />
            <MobileNavItem onClick={() => handleNav('upload')}>Upload</MobileNavItem>
            <MobileNavItem onClick={() => handleNav('admin')}>Admin Panel</MobileNavItem>
            <div style={{ height: '1px', background: 'var(--bd)', margin: '8px 0' }} />
            <button onClick={() => onToast('Sign in coming soon!')} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '14px', cursor: 'pointer', color: 'var(--bg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 500, marginTop: '8px' }}>Sign In</button>
          </div>
        </div>
      )}

      <style>{`.desktop-nav{display:flex}.mobile-only{display:none!important}@media(max-width:768px){.desktop-nav{display:none!important}.mobile-only{display:flex!important}}`}</style>
    </>
  );
}

function MobileNavItem({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return <a onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ fontSize: '16px', color: active ? 'var(--accent)' : h ? 'var(--ink)' : 'var(--ink2)', cursor: 'pointer', padding: '12px 16px', borderRadius: '8px', background: active ? 'var(--bg3)' : h ? 'var(--bg3)' : 'transparent', fontFamily: "'JetBrains Mono', monospace", transition: 'all .2s' }}>{children}</a>;
}

function NavBtn({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const [h, setH] = useState(false);
  return <button className={className} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? 'var(--bg3)' : 'transparent', borderWidth: '1px', borderStyle: 'solid', borderColor: h ? 'var(--ink2)' : 'var(--bd2)', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: h ? 'var(--ink)' : 'var(--ink2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', transition: 'all .2s' }}>{children}</button>;
}

function AccentBtn({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const [h, setH] = useState(false);
  return <button className={className} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? 'var(--accent2)' : 'var(--accent)', border: 'none', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: 'var(--bg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500, transition: 'all .2s', transform: h ? 'translateY(-1px)' : 'none' }}>{children}</button>;
}

function ThemeDropdown({ themes, theme, themeOpen, setThemeOpen, onThemeChange }: { themes: ThemeConfig[]; theme: string; themeOpen: boolean; setThemeOpen: (v: boolean) => void; onThemeChange: (t: string) => void }) {
  const [btnH, setBtnH] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setThemeOpen(!themeOpen)} onMouseEnter={() => setBtnH(true)} onMouseLeave={() => setBtnH(false)} style={{ background: btnH ? 'var(--bg3)' : 'transparent', borderWidth: '1px', borderStyle: 'solid', borderColor: btnH ? 'var(--ink2)' : 'var(--bd2)', borderRadius: '6px', padding: '7px 12px', cursor: 'pointer', color: btnH ? 'var(--ink)' : 'var(--ink2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all .2s' }}>
        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
        <span className="desktop-nav">Theme</span>
      </button>
      {themeOpen && (
        <div style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--bg3)', border: '1px solid var(--bd2)', borderRadius: '8px', padding: '6px', minWidth: '150px', boxShadow: 'var(--shadow)', zIndex: 200 }}>
          {themes.map(t => <ThemeOption key={t.id} t={t} active={theme === t.id} onClick={() => { onThemeChange(t.id); setThemeOpen(false); }} />)}
        </div>
      )}
    </div>
  );
}

function ThemeOption({ t, active, onClick }: { t: ThemeConfig; active: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ width: '100%', textAlign: 'left', background: active ? 'var(--bg4)' : h ? 'var(--bg4)' : 'transparent', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', color: active ? 'var(--ink)' : h ? 'var(--ink)' : 'var(--ink2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all .15s' }}>
      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.preview, flexShrink: 0 }} />
      {t.label}
      {active && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '10px' }}>✓</span>}
    </button>
  );
}
