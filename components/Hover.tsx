'use client';
import React, { useState, useCallback } from 'react';

// Reusable hover wrapper for any element
interface HoverProps extends React.HTMLAttributes<HTMLDivElement> {
  base?: React.CSSProperties;
  hover?: React.CSSProperties;
  as?: 'div' | 'button';
  children: React.ReactNode;
}

export function Hv({ base = {}, hover = {}, children, style, as = 'div', ...rest }: HoverProps) {
  const [hovered, setHovered] = useState(false);
  const Tag = as as any;
  return (
    <Tag
      style={{ ...base, ...(hovered ? hover : {}), ...style, transition: 'all .2s ease' }}
      onMouseEnter={(e: React.MouseEvent) => { setHovered(true); rest.onMouseEnter?.(e as any); }}
      onMouseLeave={(e: React.MouseEvent) => { setHovered(false); rest.onMouseLeave?.(e as any); }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Common hover patterns
export function HoverCard({ children, style, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', ...style }}
      hover={{ background: 'var(--bg3)', borderColor: 'var(--bd2)' }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverRow({ children, style, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', cursor: 'pointer', ...style }}
      hover={{ background: 'var(--bg3)' }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverBranchCard({ children, style, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg3)', cursor: 'pointer', textAlign: 'center' as const, ...style }}
      hover={{ background: 'var(--bg4)' }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverButton({ children, style, onClick, variant = 'primary', disabled }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; variant?: 'primary' | 'outline' | 'ghost' | 'danger'; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);

  const variants = {
    primary: {
      base: { background: 'var(--accent)', border: 'none', color: 'var(--bg)', fontWeight: 500 },
      hover: { background: 'var(--accent2)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    },
    outline: {
      base: { background: 'transparent', border: '1px solid var(--bd2)', color: 'var(--ink2)' },
      hover: { border: '1px solid var(--accent)', color: 'var(--accent)' },
    },
    ghost: {
      base: { background: 'transparent', border: '1px solid var(--bd2)', color: 'var(--ink2)' },
      hover: { border: '1px solid var(--ink2)', color: 'var(--ink)', background: 'var(--bg3)' },
    },
    danger: {
      base: { background: 'rgba(224,90,90,.1)', border: '1px solid rgba(224,90,90,.2)', color: 'var(--red)' },
      hover: { background: 'rgba(224,90,90,.2)', border: '1px solid rgba(224,90,90,.4)' },
    },
  };

  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '13px 28px',
        borderRadius: '6px', cursor: disabled ? 'default' : 'pointer', transition: 'all .2s', letterSpacing: '0.3px',
        ...v.base, ...(hovered && !disabled ? v.hover : {}), ...style,
      }}
    >
      {children}
    </button>
  );
}

export function HoverNavLink({ children, active, onClick, style }: { children: React.ReactNode; active?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '13px', cursor: 'pointer', textDecoration: 'none', transition: 'color .2s',
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.3px',
        color: active ? 'var(--accent)' : hovered ? 'var(--ink)' : 'var(--ink2)',
        ...style,
      }}
    >
      {children}
    </a>
  );
}

export function HoverSemCard({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', ...style }}
      hover={{ borderColor: 'var(--bd2)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverNoteRow({ children, style, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', cursor: 'pointer', ...style }}
      hover={{ background: 'var(--bg3)', borderColor: 'var(--bd2)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverDownloadBtn({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', padding: '5px 12px',
        borderWidth: '1px', borderStyle: 'solid', borderColor: hovered ? 'var(--accent)' : 'var(--bd2)',
        borderRadius: '6px', background: hovered ? 'rgba(200,169,110,.06)' : 'transparent',
        color: hovered ? 'var(--accent)' : 'var(--ink2)', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
      }}
    >
      ↓ Download
    </button>
  );
}

export function HoverChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', padding: '6px 12px',
        borderWidth: '1px', borderStyle: 'solid', borderRadius: '20px', cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
        borderColor: active ? 'var(--accent)' : hovered ? 'var(--ink2)' : 'var(--bd)',
        color: active ? 'var(--accent)' : hovered ? 'var(--ink)' : 'var(--ink2)',
        background: active ? 'rgba(200,169,110,.08)' : hovered ? 'var(--bg3)' : 'transparent',
      }}
    >
      {label}
    </button>
  );
}

export function HoverFeatureCard({ icon, iconBg, title, desc }: { icon: string; iconBg: string; title: string; desc: string }) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', padding: 'clamp(1.25rem,2vw,2rem)' }}
      hover={{ background: 'var(--bg3)' }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: iconBg }}>{icon}</div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '.5rem' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{desc}</p>
    </Hv>
  );
}

export function HoverFooterLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block', fontSize: '13px', cursor: 'pointer', marginBottom: '.4rem',
        textDecoration: 'none', transition: 'color .2s',
        color: hovered ? 'var(--ink)' : 'var(--ink3)',
      }}
    >
      {children}
    </a>
  );
}

export function HoverTeamCard({ initials, name, role, bg, color }: { initials: string; name: string; role: string; bg: string; color: string }) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' as const }}
      hover={{ borderColor: 'var(--bd2)', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
    >
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto .75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, background: bg, color }}>{initials}</div>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>{name}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)' }}>{role}</div>
    </Hv>
  );
}

export function HoverQCard({ children, style, onClick, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Hv
      base={{ background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: '.5rem', ...style }}
      hover={{ background: 'var(--bg3)', borderColor: 'var(--bd2)' }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Hv>
  );
}

export function HoverPill({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: bg, color, transition: 'all .2s' }}>{children}</span>
  );
}
