'use client';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClear: () => void;
}

export function Toast({ message, onClear }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onClear, 300);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 3vw, 2rem)',
        right: 'clamp(1rem, 3vw, 2rem)',
        left: 'auto',
        maxWidth: 'calc(100vw - 2rem)',
        background: 'var(--bg3)',
        border: '1px solid var(--bd2)',
        borderRadius: '6px',
        padding: '.75rem 1.25rem',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        color: 'var(--accent)',
        lineHeight: 1.5,
        wordBreak: 'break-word',
        zIndex: 999,
        transition: 'all .3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
