'use client';
import { Page, BranchConfig } from '@/lib/types';
import { HoverButton, HoverRow, HoverBranchCard, HoverFeatureCard, HoverCard } from './Hover';

interface HomePageProps { onNav: (page: Page) => void; onToast: (msg: string) => void; branches: BranchConfig[]; }

export function HomePage({ onNav, onToast, branches }: HomePageProps) {
  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ position: 'relative', padding: 'clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem) clamp(2rem,4vw,3rem)', overflow: 'hidden', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 70% 50%, rgba(200,169,110,0.06) 0%, transparent 70%)' }} />
        <div className="hero-grid" style={{ display: 'grid', gap: 'clamp(1.5rem,4vw,4rem)', alignItems: 'center', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent)', display: 'inline-block' }} />AKTU STUDENT RESOURCE HUB
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: '1.25rem', color: 'var(--ink)' }}>Your academic<br /><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>arsenal</em>,<br />organised.</h1>
            <p style={{ fontSize: '15px', color: 'var(--ink2)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '460px' }}>Previous year quantum papers, handwritten notes, and syllabus for every AKTU branch and semester — all in one place.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <HoverButton variant="primary" onClick={() => onNav('quantums')}>Browse Quantums →</HoverButton>
              <HoverButton variant="outline" onClick={() => onNav('notes')}>Find Notes</HoverButton>
            </div>
          </div>
          <div className="hero-visual-container">
            <div style={{ position: 'relative', height: '320px' }}>
              {[{ tag: 'ME · SEM 5', title: 'Fluid Mechanics', code: 'ME-501', year: '2023', st: { width: '260px', top: 0, right: '20px', transform: 'rotate(3deg)', zIndex: 1 } as React.CSSProperties },
                { tag: 'CS · SEM 4', title: 'Theory of Computation', code: 'CS-401', year: '2024', st: { width: '280px', top: '40px', right: 0, zIndex: 2 } as React.CSSProperties },
                { tag: 'EC · SEM 3', title: 'Analog Electronics', code: 'EC-301', year: '2022', st: { width: '240px', top: '90px', right: '30px', transform: 'rotate(-2deg)', zIndex: 1, opacity: .6 } as React.CSSProperties },
              ].map((c, i) => (
                <HoverCard key={i} style={{ position: 'absolute', padding: '1.25rem', ...c.st }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '.5rem' }}>{c.tag}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '.75rem', lineHeight: 1.4 }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'rgba(200,169,110,.12)', color: 'var(--accent)' }}>{c.code}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--ink3)' }}>{c.year}</span>
                  </div>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-band-responsive" style={{ display: 'grid', gap: '1px', background: 'var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        {[{ num: '2,400+', label: 'QUANTUM PAPERS' },{ num: '800+', label: 'STUDY NOTES' },{ num: '12', label: 'BRANCHES' },{ num: '8', label: 'SEMESTERS' }].map((s, i) => (
          <div key={i} style={{ padding: 'clamp(1rem,2vw,2rem)', textAlign: 'center', background: 'var(--bg)' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,36px)', color: 'var(--accent)', display: 'block', lineHeight: 1 }}>{s.num}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px,1.2vw,11px)', color: 'var(--ink3)', letterSpacing: '1px', marginTop: '.4rem', display: 'block' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2rem,4vw,4rem) clamp(1rem,3vw,2rem)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.75rem' }}>WHY QUANTUMVAULT</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,38px)', lineHeight: 1.15, marginBottom: '.75rem' }}>Everything you need<br />to crack AKTU.</h2>
        <p style={{ fontSize: '15px', color: 'var(--ink2)', lineHeight: 1.6, maxWidth: '500px', marginBottom: '3rem' }}>Built by AKTU students, for AKTU students. No clutter, no paywalls.</p>
        <div className="feat-grid-responsive" style={{ display: 'grid', gap: '1px', background: 'var(--bd)', border: '1px solid var(--bd)', borderRadius: '20px', overflow: 'hidden' }}>
          {[{ icon: '📄', bg: 'rgba(61,186,126,.1)', h: 'Previous Year Papers', p: 'All subjects, all branches, going back 10 years. Download instantly as PDF.' },
            { icon: '📝', bg: 'rgba(79,156,240,.1)', h: 'Handwritten Notes', p: "Toppers' notes, typed guides, and PPTs — uploaded and verified by peers." },
            { icon: '🗂️', bg: 'rgba(200,169,110,.1)', h: 'Complete Syllabus', p: 'Subject-wise syllabus for all branches and semesters, always updated.' },
            { icon: '⚡', bg: 'rgba(224,90,90,.1)', h: 'Instant Search', p: 'Find any paper in seconds by subject name, code, branch, or year.' },
            { icon: '🎓', bg: 'rgba(160,100,220,.1)', h: 'Community Uploads', p: 'Students contribute their notes and papers to help the next batch.' },
            { icon: '📱', bg: 'rgba(50,190,200,.1)', h: 'Mobile Friendly', p: 'Study from your phone, tablet, or laptop — fully responsive design.' },
          ].map((f, i) => <HoverFeatureCard key={i} icon={f.icon} iconBg={f.bg} title={f.h} desc={f.p} />)}
        </div>
      </div>

      {/* Branches */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2rem,4vw,4rem) clamp(1rem,3vw,2rem)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.75rem' }}>EXPLORE BY BRANCH</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,38px)', marginBottom: '2rem' }}>Pick your branch.</h2>
          <div className="branch-grid-responsive" style={{ display: 'grid', gap: '1px', background: 'var(--bd)', borderRadius: '20px', overflow: 'hidden' }}>
            {branches.map((b, i) => (
              <HoverBranchCard key={i} onClick={() => onNav('quantums')} style={{ padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '24px', marginBottom: '.6rem' }}>{b.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '.25rem' }}>{b.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)' }}>{b.paperCount} papers</div>
              </HoverBranchCard>
            ))}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2rem,4vw,4rem) clamp(1rem,3vw,2rem)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.75rem' }}>LATEST ADDITIONS</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,38px)', marginBottom: '2rem' }}>Recently added.</h2>
        <div className="recent-grid-responsive" style={{ display: 'grid', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--bd)', border: '1px solid var(--bd)', borderRadius: '12px', overflow: 'hidden' }}>
            {[{ icon: '📄', title: 'Compiler Design — 2024 Quantum', meta: 'CS · Sem 6 · CS-601 · 1.2 MB', badge: 'NEW', bc: 'rgba(61,186,126,.12)', bt: 'var(--green)' },
              { icon: '📝', title: 'OS — Complete Handwritten Notes', meta: 'CS · Sem 5 · 48 pages · 4.2 MB', badge: 'NOTE', bc: 'rgba(79,156,240,.12)', bt: 'var(--blue)' },
              { icon: '📄', title: 'DBMS — 2024 Quantum Paper', meta: 'CS · Sem 4 · CS-402 · 980 KB', badge: 'NEW', bc: 'rgba(61,186,126,.12)', bt: 'var(--green)' },
              { icon: '📄', title: 'Thermodynamics — 2024 Quantum', meta: 'ME · Sem 4 · ME-401 · 1.5 MB', badge: 'NEW', bc: 'rgba(61,186,126,.12)', bt: 'var(--green)' },
              { icon: '📝', title: 'Analog Electronics — Handwritten', meta: 'EC · Sem 3 · 60 pages · 6.1 MB', badge: 'NOTE', bc: 'rgba(79,156,240,.12)', bt: 'var(--blue)' },
              { icon: '📄', title: 'Computer Networks — 2023 Quantum', meta: 'CS · Sem 6 · CS-602 · 1.1 MB', badge: 'PDF', bc: 'rgba(200,169,110,.12)', bt: 'var(--accent)' },
            ].map((r, i) => (
              <HoverRow key={i} style={{ padding: '1rem 1.25rem', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0, background: r.icon === '📄' ? 'rgba(200,169,110,.1)' : 'rgba(61,186,126,.1)' }}>{r.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)', marginTop: '2px' }}>{r.meta}</div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '2px 8px', borderRadius: '3px', flexShrink: 0, background: r.bc, color: r.bt }}>{r.badge}</span>
              </HoverRow>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <HoverCard style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>By Branch</div>
              {[['Computer Science','614'],['Electronics','490'],['Mechanical','388'],['Civil','310'],['Electrical','290']].map(([n,c],i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--bd)', fontSize: '13px', color: 'var(--ink2)' }}>{n}<span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)' }}>{c}</span></div>
              ))}
            </HoverCard>
            <HoverCard style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '1rem' }}>🔥 Trending Papers</div>
              {[{ name: 'Operating Systems 2024', sub: 'CS · Sem 5 · 2.4k downloads' },{ name: 'DBMS 2024', sub: 'CS · Sem 4 · 1.8k downloads' },{ name: 'Fluid Mechanics 2023', sub: 'ME · Sem 5 · 1.4k downloads' },{ name: 'Theory of Computation', sub: 'CS · Sem 4 · 1.2k downloads' }].map((t,i) => (
                <div key={i} style={{ display: 'flex', gap: '.75rem', alignItems: 'center', padding: '.6rem 0', borderBottom: i<3?'1px solid var(--bd)':'none' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)', width: '16px', flexShrink: 0 }}>{i+1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)' }}>{t.sub}</div>
                  </div>
                </div>
              ))}
            </HoverCard>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
        .hero-visual-container{display:block}
        .stats-band-responsive{grid-template-columns:repeat(4,1fr)}
        .feat-grid-responsive{grid-template-columns:repeat(3,1fr)}
        .branch-grid-responsive{grid-template-columns:repeat(${Math.min(branches.length,6)},1fr)}
        .recent-grid-responsive{grid-template-columns:2fr 1fr}
        @media(max-width:980px){
          .feat-grid-responsive{grid-template-columns:repeat(2,1fr)}
          .recent-grid-responsive{grid-template-columns:1fr}
        }
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr}
          .hero-visual-container{display:none!important}
        }
        @media(max-width:768px){
          .stats-band-responsive{grid-template-columns:repeat(2,1fr)}
          .feat-grid-responsive{grid-template-columns:1fr}
          .branch-grid-responsive{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:480px){.branch-grid-responsive{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:360px){.stats-band-responsive{grid-template-columns:1fr}.branch-grid-responsive{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
