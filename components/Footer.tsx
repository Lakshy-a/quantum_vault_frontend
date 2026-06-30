'use client';
import { Page } from '@/lib/types';
import { HoverFooterLink } from './Hover';

interface FooterProps { onNav: (page: Page) => void; onToast: (msg: string) => void; }

export function Footer({ onNav, onToast }: FooterProps) {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem,4vw,3rem) clamp(1rem,3vw,2rem)' }}>
        <div className="footer-grid-responsive" style={{ display: 'grid', gap: 'clamp(1.5rem,3vw,3rem)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onNav('home')}>
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="var(--bg)"><path d="M10 2L2 7v6l8 5 8-5V7L10 2zm0 2.5L16 8l-6 3.75L4 8l6-3.5zM3.5 9.25L9 12.5V17L3.5 13.75V9.25zm7 3.25l5.5-3.25v4.5L10.5 17v-4.5z" /></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--ink)' }}>QuantumVault</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--accent)', letterSpacing: '1.5px' }}>AKTU PORTAL</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink3)', marginTop: '.75rem', lineHeight: 1.6, maxWidth: '320px' }}>A free resource hub for AKTU students — previous year papers, notes, and syllabus, all in one place.</p>
          </div>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '1.5px', marginBottom: '.75rem' }}>RESOURCES</h4>
            <HoverFooterLink onClick={() => onNav('quantums')}>Quantum Papers</HoverFooterLink>
            <HoverFooterLink onClick={() => onNav('notes')}>Study Notes</HoverFooterLink>
            <HoverFooterLink onClick={() => onNav('syllabus')}>Syllabus</HoverFooterLink>
          </div>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '1.5px', marginBottom: '.75rem' }}>PORTAL</h4>
            <HoverFooterLink onClick={() => onNav('about')}>About Us</HoverFooterLink>
            <HoverFooterLink onClick={() => onNav('upload')}>Upload</HoverFooterLink>
            <HoverFooterLink onClick={() => onToast('Contact page coming soon!')}>Contact</HoverFooterLink>
          </div>
          <div style={{ minWidth: 0 }}>
            <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '1.5px', marginBottom: '.75rem' }}>BRANCHES</h4>
            {['Computer Science','Electronics','Mechanical','Civil'].map(b => <HoverFooterLink key={b} onClick={() => onNav('quantums')}>{b}</HoverFooterLink>)}
          </div>
        </div>
        <div style={{ marginTop: 'clamp(1.5rem,3vw,2.5rem)', paddingTop: '1.5rem', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.75rem' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)', lineHeight: 1.5 }}>© 2024 QuantumVault. Built with ❤ by AKTU students.</span>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {['AKTU','FREE','OPEN'].map(b => <span key={b} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg3)', color: 'var(--ink3)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)' }}>{b}</span>)}
          </div>
        </div>
      </div>
      <style>{`.footer-grid-responsive{grid-template-columns:2fr 1fr 1fr 1fr}@media(max-width:768px){.footer-grid-responsive{grid-template-columns:1fr 1fr 1fr}}@media(max-width:480px){.footer-grid-responsive{grid-template-columns:1fr 1fr}}@media(max-width:360px){.footer-grid-responsive{grid-template-columns:1fr}}`}</style>
    </footer>
  );
}
