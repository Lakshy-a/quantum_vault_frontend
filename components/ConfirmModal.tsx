'use client';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg2)', border: '1px solid var(--bd2)', borderRadius: '12px', padding: 'clamp(1.25rem,3vw,2rem)', maxWidth: '420px', width: '100%', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--bd2)', color: 'var(--ink2)', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink2)'; e.currentTarget.style.color = 'var(--ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.color = 'var(--ink2)'; }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', background: 'rgba(224,90,90,.15)', border: '1px solid rgba(224,90,90,.3)', color: 'var(--red)', fontWeight: 500, transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,90,90,.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(224,90,90,.15)'; }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
