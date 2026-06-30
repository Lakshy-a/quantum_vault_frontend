'use client';
import { Hv, HoverTeamCard } from './Hover';

export function AboutPage() {
  return (
    <div className="page-fade">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) clamp(1rem,3vw,2rem)', textAlign: 'center' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.75rem' }}>THE STORY</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,44px)', letterSpacing: '-0.8px', marginBottom: '1rem', lineHeight: 1.1 }}>Built by students,<br />for <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>students</em>.</h1>
        <p style={{ fontSize: '15px', color: 'var(--ink2)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 3rem' }}>QuantumVault was born out of frustration — scrambling for previous year papers before exams, relying on blurry Telegram PDFs, and never knowing if the syllabus was updated. We fixed that.</p>
      </div>
      <div style={{ maxWidth: '1000px', margin: '0 auto 4rem', padding: '0 clamp(1rem,3vw,2rem)' }}>
      <div className="about-grid-responsive" style={{ display: 'grid', gap: '1px', background: 'var(--bd)', border: '1px solid var(--bd)', borderRadius: '20px', overflow: 'hidden' }}>
        {[{ icon: '🎯', h: 'Our Mission', p: "Make every AKTU student's study journey smoother by centralising resources that are free, organised, and always available." },
          { icon: '🤝', h: 'Community First', p: 'Everything here is contributed by AKTU students themselves. Toppers share notes, seniors upload papers — it grows with every batch.' },
          { icon: '🔓', h: 'Always Free', p: 'No paywalls, no premium tiers, no ads. Just resources — available to every student equally, on every device.' },
        ].map((c, i) => (
          <Hv key={i} base={{ background: 'var(--bg2)', padding: 'clamp(1.25rem,2vw,2rem)', textAlign: 'center' as const }} hover={{ background: 'var(--bg3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '1rem' }}>{c.icon}</div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '.5rem' }}>{c.h}</h3>
            <p style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6 }}>{c.p}</p>
          </Hv>
        ))}
      </div>
      </div>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 clamp(1rem,3vw,2rem) 4rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '.75rem' }}>THE TEAM</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,32px)', marginBottom: '2rem' }}>Who built this.</h2>
        <div className="team-grid-responsive" style={{ display: 'grid', gap: '1.25rem' }}>
          <HoverTeamCard initials="AK" name="Arjun Kumar" role="FOUNDER · CS SEM 6" bg="rgba(61,186,126,.12)" color="var(--green)" />
          <HoverTeamCard initials="PS" name="Priya Sharma" role="DESIGN · CS SEM 5" bg="rgba(79,156,240,.12)" color="var(--blue)" />
          <HoverTeamCard initials="RV" name="Rohit Verma" role="BACKEND · CS SEM 6" bg="rgba(200,169,110,.12)" color="var(--accent)" />
        </div>
      </div>
      <style>{`.about-grid-responsive{grid-template-columns:repeat(3,1fr)}.team-grid-responsive{grid-template-columns:repeat(3,1fr)}@media(max-width:768px){.about-grid-responsive{grid-template-columns:1fr}.team-grid-responsive{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.team-grid-responsive{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
