'use client';
import { useState } from 'react';
import { Page, NoteConfig } from '@/lib/types';
import { HoverButton, HoverChip, HoverNoteRow, HoverDownloadBtn } from './Hover';

interface NotesPageProps { onNav: (page: Page) => void; onToast: (msg: string) => void; notes: NoteConfig[]; }

export function NotesPage({ onNav, onToast, notes }: NotesPageProps) {
  const [activeType, setActiveType] = useState('All Types');
  const [activeBranch, setActiveBranch] = useState('All Branches');
  const [search, setSearch] = useState('');
  const types = ['All Types', 'Handwritten', 'Typed PDF', 'Slides'];
  const brs = ['All Branches', 'CS/IT', 'EC', 'ME'];
  const filtered = notes.filter(n => (activeType === 'All Types' || n.type === activeType) && (activeBranch === 'All Branches' || (activeBranch === 'CS/IT' && n.branch.startsWith('CS')) || (activeBranch === 'EC' && n.branch.startsWith('EC')) || (activeBranch === 'ME' && n.branch.startsWith('ME'))) && (!search || n.title.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="page-fade">
      <div style={{ borderBottom: '1px solid var(--bd)' }}>
        <div style={{ padding: '2.5rem clamp(1rem,3vw,2rem) 0', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,32px)' }}>Study Notes</h1>
              <p style={{ fontSize: '13px', color: 'var(--ink2)', marginTop: '.25rem' }}>{notes.length}+ handwritten notes, typed PDFs, and slides by AKTU students</p>
            </div>
            <HoverButton variant="primary" onClick={() => onNav('upload')} style={{ fontSize: '12px', padding: '7px 16px' }}>Upload notes</HoverButton>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', padding: '1.5rem clamp(1rem,3vw,1.5rem)', flexWrap: 'wrap', borderBottom: '1px solid var(--bd)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: '6px', padding: '0 12px' }}>
          <span style={{ color: 'var(--ink3)' }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject or topic…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Figtree', sans-serif", fontSize: '13px', color: 'var(--ink)', padding: '10px 0' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{types.map(t => <HoverChip key={t} label={t} active={activeType === t} onClick={() => setActiveType(t)} />)}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{brs.map(b => <HoverChip key={b} label={b} active={activeBranch === b} onClick={() => setActiveBranch(b)} />)}</div>
      </div>
      <div style={{ padding: '1rem clamp(1rem,3vw,1.5rem) .5rem', maxWidth: '1100px', margin: '0 auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)', letterSpacing: '1px' }}>SHOWING {filtered.length} OF {notes.length} NOTES</div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(1rem,3vw,1.5rem) 2rem' }}>
        {filtered.map((n, i) => (
          <HoverNoteRow key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 1.25rem', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '6px', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, background: 'var(--bg3)' }}>{n.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{n.title}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: n.branchColor, color: n.branchText }}>{n.branch}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--ink3)' }}>{n.type}</span>
                <span className="note-pages-pill" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'var(--bg4)', color: 'var(--ink3)' }}>{n.pages}</span>
              </div>
            </div>
            <div className="note-right-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              <span className="note-size-label" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink3)' }}>{n.size}</span>
              <HoverDownloadBtn onClick={e => { e?.stopPropagation(); onToast('Download started!'); }} />
            </div>
          </HoverNoteRow>
        ))}
      </div>
      <style>{`@media(max-width:480px){.note-size-label{display:none!important}.note-pages-pill{display:none!important}}`}</style>
    </div>
  );
}
