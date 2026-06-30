'use client';
import { useState } from 'react';
import { BranchSyllabusConfig } from '@/lib/types';
import { HoverChip, HoverSemCard } from './Hover';

interface SyllabusPageProps { syllabus: BranchSyllabusConfig[]; }

export function SyllabusPage({ syllabus }: SyllabusPageProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const data = syllabus[activeIdx] || syllabus[0];

  return (
    <div className="page-fade">
      <div style={{ borderBottom: '1px solid var(--bd)' }}>
        <div style={{ padding: '2.5rem clamp(1rem,3vw,2rem) 0', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ paddingBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,32px)' }}>Syllabus</h1>
            <p style={{ fontSize: '13px', color: 'var(--ink2)', marginTop: '.25rem' }}>Subject-wise syllabus for all AKTU branches and semesters</p>
          </div>
        </div>
      </div>
      <div className="syl-mobile-select" style={{ padding: '1rem clamp(1rem,3vw,2rem)', maxWidth: '1100px', margin: '0 auto', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {syllabus.map((b, i) => (
            <HoverChip key={b.code} label={b.code} active={activeIdx === i} onClick={() => setActiveIdx(i)} />
          ))}
        </div>
      </div>
      <div className="syl-layout-responsive" style={{ display: 'grid', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh', alignItems: 'start' }}>
        <div className="syl-sidebar-desktop" style={{ borderRight: '1px solid var(--bd)', padding: '1.5rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.75rem' }}>SELECT BRANCH</div>
          {syllabus.map((b, i) => <SylSidebarBtn key={b.code} label={b.code} dot={b.dot} active={activeIdx === i} onClick={() => setActiveIdx(i)} />)}
        </div>
        <div style={{ padding: 'clamp(1rem,3vw,2rem)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px,3vw,26px)', marginBottom: '.25rem' }}>{data.name}</h2>
          <p style={{ fontSize: '13px', color: 'var(--ink2)', marginBottom: '2rem' }}>{data.sub}</p>
          <div className="sem-grid-responsive" style={{ display: 'grid', gap: '1.25rem' }}>
            {data.semesters.map((sem, i) => (
              <HoverSemCard key={i}>
                <div style={{ padding: '.75rem 1rem', borderBottom: '1px solid var(--bd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '1px' }}>{sem.num}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)' }}>{sem.count}</span>
                </div>
                <div style={{ padding: '.5rem 0' }}>
                  {sem.subjects.map((s, j) => (
                    <div key={j} style={{ padding: '.45rem 1rem', fontSize: '13px', color: 'var(--ink2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: j < sem.subjects.length - 1 ? '1px solid var(--bd)' : 'none', gap: '8px' }}>
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', flexShrink: 0 }}>{s.code}</span>
                    </div>
                  ))}
                </div>
              </HoverSemCard>
            ))}
          </div>
        </div>
      </div>
      <style>{`.syl-layout-responsive{grid-template-columns:240px 1fr}.syl-mobile-select{display:none}.sem-grid-responsive{grid-template-columns:repeat(2,1fr)}@media(max-width:768px){.syl-layout-responsive{grid-template-columns:1fr}.syl-sidebar-desktop{display:none!important}.syl-mobile-select{display:block!important}.sem-grid-responsive{grid-template-columns:1fr}}`}</style>
    </div>
  );
}

function SylSidebarBtn({ label, dot, active, onClick }: { label: string; dot: string; active: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ width: '100%', textAlign: 'left', padding: '.6rem .75rem', borderRadius: '6px', fontSize: '13px', background: active ? 'var(--bg3)' : h ? 'var(--bg3)' : 'transparent', border: 'none', color: active ? 'var(--accent)' : h ? 'var(--ink)' : 'var(--ink2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '3px', transition: 'all .2s' }}>
    <span style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: dot }} />{label}
  </button>;
}
