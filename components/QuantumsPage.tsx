'use client';
import { useState } from 'react';
import { Page, PaperConfig, BranchConfig } from '@/lib/types';
import { HoverButton, HoverChip, HoverQCard } from './Hover';

interface QuantumsPageProps { onNav: (page: Page) => void; onToast: (msg: string) => void; papers: PaperConfig[]; branches: BranchConfig[]; }

const PAGE_SIZE = 12;

export function QuantumsPage({ onNav, onToast, papers, branches }: QuantumsPageProps) {
  const [activeBranch, setActiveBranch] = useState(0);
  const [activeSem, setActiveSem] = useState(-1);
  const [activeYear, setActiveYear] = useState('All Years');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const years = ['All Years', '2024', '2023', '2022', '2021'];
  const sidebarBranches = [{ label: 'All Branches', count: papers.length.toString() }, ...branches.map(b => ({ label: b.label, count: papers.filter(p => p.branch === b.code).length.toString() }))];
  const sidebarSems = [1,2,3,4,5,6,7,8].map(n => ({ label: `Semester ${n}`, count: papers.filter(p => p.semester === n).length.toString() }));

  const filtered = papers.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())) &&
    (activeYear === 'All Years' || p.year === activeYear) &&
    (activeBranch === 0 || p.branch === branches[activeBranch - 1]?.code) &&
    (activeSem === -1 || p.semester === activeSem + 1)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="page-fade">
      <div style={{ borderBottom: '1px solid var(--bd)' }}>
        <div style={{ padding: '2.5rem clamp(1rem,3vw,2rem) 0', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,32px)' }}>Quantum Papers</h1>
              <p style={{ fontSize: '13px', color: 'var(--ink2)', marginTop: '.25rem' }}>{papers.length.toLocaleString()}+ previous year papers across all AKTU branches</p>
            </div>
            <HoverButton variant="primary" onClick={() => onNav('upload')} style={{ fontSize: '12px', padding: '7px 16px' }}>Upload a paper</HoverButton>
          </div>
        </div>
      </div>
      <div className="quantum-layout" style={{ display: 'grid', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh', alignItems: 'start' }}>
        <div className="quantum-sidebar" style={{ borderRight: '1px solid var(--bd)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.6rem' }}>BRANCH</div>
            {sidebarBranches.map((b, i) => <SidebarItem key={i} label={b.label} count={b.count} active={activeBranch === i} onClick={() => { setActiveBranch(i); resetPage(); }} />)}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.6rem' }}>SEMESTER</div>
            {sidebarSems.map((s, i) => <SidebarItem key={i} label={s.label} count={s.count} active={activeSem === i} onClick={() => { setActiveSem(activeSem === i ? -1 : i); resetPage(); }} />)}
          </div>
        </div>
        <div style={{ padding: 'clamp(1rem,2vw,1.5rem)', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: '6px', padding: '0 12px' }}>
              <span style={{ color: 'var(--ink3)', fontSize: '14px' }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject, code, or keyword…" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Figtree', sans-serif", fontSize: '13px', color: 'var(--ink)', padding: '10px 0' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {years.map(y => <HoverChip key={y} label={y} active={activeYear === y} onClick={() => { setActiveYear(y); resetPage(); }} />)}
            </div>
          </div>

          {/* Mobile-only branch + semester filters (sidebar is hidden below 768px) */}
          <div className="quantum-mobile-filters" style={{ marginBottom: '1.5rem', display: 'none', flexDirection: 'column', gap: '.6rem', minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.4rem' }}>BRANCH</div>
              <div className="chip-scroll" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {sidebarBranches.map((b, i) => <HoverChip key={i} label={`${b.label} (${b.count})`} active={activeBranch === i} onClick={() => { setActiveBranch(i); resetPage(); }} />)}
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', letterSpacing: '1.5px', marginBottom: '.4rem' }}>SEMESTER</div>
              <div className="chip-scroll" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                <HoverChip label="All Sems" active={activeSem === -1} onClick={() => { setActiveSem(-1); resetPage(); }} />
                {sidebarSems.map((s, i) => <HoverChip key={i} label={`Sem ${i + 1}`} active={activeSem === i} onClick={() => { setActiveSem(activeSem === i ? -1 : i); resetPage(); }} />)}
              </div>
            </div>
          </div>
          <div className="q-card-grid" style={{ display: 'grid', gap: '12px' }}>
            {paginated.map((p, i) => (
              <HoverQCard key={p.id || i} onClick={() => onToast('Opening paper…')}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ink3)', letterSpacing: '1px' }}>{p.tag}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{p.title}</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', paddingTop: '.5rem', borderTop: '1px solid var(--bd)', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: p.color, color: p.textColor }}>{p.code}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--ink3)' }}>{p.year}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)', marginLeft: 'auto' }}>{p.size}</span>
                </div>
              </HoverQCard>
            ))}
            {filtered.length === 0 && <div style={{ gridColumn: '1 / -1', background: 'var(--bg2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--bd)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', color: 'var(--ink3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>No papers match your filters.</div>}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <PageBtn label="‹" active={false} disabled={safePage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} />
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | '…')[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) => p === '…'
                  ? <span key={`ellipsis-${i}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--ink3)', padding: '0 4px' }}>…</span>
                  : <PageBtn key={p} label={String(p)} active={safePage === p} disabled={false} onClick={() => setCurrentPage(p as number)} />
                )}
              <PageBtn label="›" active={false} disabled={safePage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)', marginLeft: '8px' }}>{filtered.length} results</span>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .quantum-layout{grid-template-columns:220px 1fr}
        .q-card-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
        .chip-scroll{scrollbar-width:none}
        .chip-scroll::-webkit-scrollbar{display:none}
        @media(max-width:1024px){.quantum-layout{grid-template-columns:190px 1fr}.q-card-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}
        @media(max-width:768px){.quantum-layout{grid-template-columns:1fr}.quantum-sidebar{display:none!important}.quantum-mobile-filters{display:flex!important}.q-card-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}}
        @media(max-width:420px){.q-card-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function SidebarItem({ label, count, active, onClick }: { label: string; count: string; active: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', justifyContent: 'space-between', padding: '.45rem .75rem', borderRadius: '6px', fontSize: '13px', color: active ? 'var(--accent)' : h ? 'var(--ink)' : 'var(--ink2)', cursor: 'pointer', background: active ? 'var(--bg3)' : h ? 'var(--bg3)' : 'transparent', marginBottom: '2px', transition: 'all .2s' }}>{label} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ink3)' }}>{count}</span></div>;
}

function PageBtn({ label, active, disabled, onClick }: { label: string; active: boolean; disabled: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', padding: '6px 11px', borderWidth: '1px', borderStyle: 'solid', borderColor: active ? 'var(--accent)' : h && !disabled ? 'var(--ink2)' : 'var(--bd)', borderRadius: '6px', background: active ? 'var(--accent)' : h && !disabled ? 'var(--bg3)' : 'transparent', color: active ? 'var(--bg)' : disabled ? 'var(--ink3)' : h ? 'var(--ink)' : 'var(--ink2)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .2s', opacity: disabled ? 0.4 : 1 }}>{label}</button>;
}
