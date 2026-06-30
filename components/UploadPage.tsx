'use client';
import { useState, useRef } from 'react';
import { BranchConfig } from '@/lib/types';
import { api } from '@/lib/api';
import { HoverButton, Hv } from './Hover';

interface UploadPageProps { onToast: (msg: string) => void; branches: BranchConfig[]; }

export function UploadPage({ onToast, branches }: UploadPageProps) {
  const [type, setType] = useState('Quantum Paper');
  const [branch, setBranch] = useState(branches[0]?.label || 'Computer Science');
  const [semester, setSemester] = useState('Semester 1');
  const [year, setYear] = useState('2024');
  const [subject, setSubject] = useState('');
  const [code, setCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const s: React.CSSProperties = { background: 'var(--bg2)', border: '1px solid var(--bd2)', borderRadius: '6px', padding: '10px 14px', fontFamily: "'Figtree', sans-serif", fontSize: '13px', color: 'var(--ink)', outline: 'none', width: '100%', cursor: 'pointer' };
  const inp: React.CSSProperties = { ...s, cursor: 'text' };
  const lbl: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ink2)', letterSpacing: '1px', display: 'block', marginBottom: '.5rem' };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    const allowed = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowed.includes(f.type)) return onToast('Only PDF, PPT, and PPTX files are allowed');
    if (f.size > 50 * 1024 * 1024) return onToast('File must be under 50 MB');
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!subject.trim()) return onToast('Enter a subject name');
    if (!file) return onToast('Please select a file');
    setSubmitting(true);
    try {
      await api.uploads.submit(file, {
        subject: subject.trim(),
        branch,
        semester,
        year,
        type,
        code: code.trim() || undefined,
      });
      onToast('Submitted! Your file is under review — thank you for contributing.');
      setFile(null);
      setSubject('');
      setCode('');
    } catch (err: any) {
      onToast(err.message || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-fade">
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1rem,3vw,2rem)' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.5rem' }}>CONTRIBUTE</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,32px)', marginBottom: '.5rem' }}>Upload a Paper or Note</h1>
        <p style={{ fontSize: '14px', color: 'var(--ink2)', marginBottom: '2rem' }}>Help the next batch. Share what you have — quantum papers, handwritten notes, or slides.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-row-responsive" style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={lbl}>TYPE</label><select value={type} onChange={e => setType(e.target.value)} style={s}><option>Quantum Paper</option><option>Handwritten Notes</option><option>Typed PDF</option><option>Slides / PPT</option></select></div>
            <div><label style={lbl}>BRANCH</label><select value={branch} onChange={e => setBranch(e.target.value)} style={s}>{branches.map(b => <option key={b.code}>{b.label}</option>)}</select></div>
          </div>
          <div className="form-row-responsive" style={{ display: 'grid', gap: '1rem' }}>
            <div><label style={lbl}>SEMESTER</label><select value={semester} onChange={e => setSemester(e.target.value)} style={s}>{[1,2,3,4,5,6,7,8].map(n => <option key={n}>Semester {n}</option>)}</select></div>
            <div><label style={lbl}>YEAR</label><select value={year} onChange={e => setYear(e.target.value)} style={s}>{['2024','2023','2022','2021','2020'].map(y => <option key={y}>{y}</option>)}</select></div>
          </div>
          <div><label style={lbl}>SUBJECT NAME *</label><input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Theory of Computation" style={inp} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <div><label style={lbl}>SUBJECT CODE</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. KCS-401 (optional)" style={inp} onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={e => (e.currentTarget.style.borderColor = 'var(--bd2)')} /></div>
          <div>
            <label style={lbl}>FILE *</label>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.ppt,.pptx"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0] ?? null)}
            />
            <Hv
              base={{ background: file ? 'rgba(61,186,126,.04)' : 'var(--bg2)', border: `2px dashed ${file ? 'var(--green)' : dragOver ? 'var(--accent)' : 'var(--bd2)'}`, borderRadius: '12px', padding: 'clamp(1.5rem,4vw,3rem) 2rem', textAlign: 'center' as const, cursor: 'pointer', transition: 'all .2s' }}
              hover={{ borderColor: 'var(--accent)', background: 'rgba(200,169,110,.04)' }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '.75rem' }}>✅</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '.25rem', color: 'var(--green)' }}>{file.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--ink3)' }}>{formatSize(file.size)} · Click to change</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '.75rem' }}>📁</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '.25rem' }}>Drop your file here, or click to browse</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--ink3)' }}>PDF, PPTX — max 50 MB</div>
                </>
              )}
            </Hv>
          </div>
          <HoverButton
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: '100%', padding: '13px', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Uploading…' : 'Submit for Review →'}
          </HoverButton>
          <p style={{ fontSize: '12px', color: 'var(--ink3)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>All uploads are reviewed before going live.</p>
        </div>
      </div>
      <style>{`.form-row-responsive{grid-template-columns:1fr 1fr}@media(max-width:480px){.form-row-responsive{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
