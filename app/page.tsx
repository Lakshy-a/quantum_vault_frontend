'use client';
import { useState, useCallback, useEffect } from 'react';
import { Page, SiteConfig } from '@/lib/types';
import { loadConfigFromAPI, applyCustomThemeVars, clearCustomThemeVars } from '@/lib/store';
import { isLoggedIn, setToken, clearToken } from '@/lib/auth';
import { api } from '@/lib/api';
import { Topbar } from '@/components/Topbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { HomePage } from '@/components/HomePage';
import { QuantumsPage } from '@/components/QuantumsPage';
import { NotesPage } from '@/components/NotesPage';
import { SyllabusPage } from '@/components/SyllabusPage';
import { AboutPage } from '@/components/AboutPage';
import { UploadPage } from '@/components/UploadPage';
import { AdminPanel } from '@/components/AdminPanel';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [theme, setTheme] = useState('dark');
  const [toastMsg, setToastMsg] = useState('');
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    setAdminLoggedIn(isLoggedIn());
    loadConfigFromAPI().then(setConfig);
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleNav = useCallback((page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleThemeChange = useCallback((themeId: string) => {
    if (!config) return;
    setTheme(themeId);
    clearCustomThemeVars();
    const themeConfig = config.themes.find(t => t.id === themeId);
    if (themeConfig?.isCustom && themeConfig.vars) {
      document.documentElement.setAttribute('data-theme', themeConfig.isDark ? 'dark' : 'light');
      applyCustomThemeVars(themeConfig.vars);
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }, [config]);

  const showToast = useCallback((msg: string) => setToastMsg(msg), []);
  const clearToast = useCallback(() => setToastMsg(''), []);

  const handleConfigChange = useCallback((newConfig: SiteConfig) => {
    setConfig(newConfig);
  }, []);

  const handleRefreshConfig = useCallback(() => {
    loadConfigFromAPI().then(setConfig);
  }, []);

  const handleAdminLogin = useCallback(async (id: string, pass: string): Promise<boolean> => {
    try {
      const { access_token } = await api.auth.login(id, pass);
      setToken(access_token);
      setAdminLoggedIn(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleAdminLogout = useCallback(() => {
    clearToken();
    setAdminLoggedIn(false);
    showToast('Logged out successfully');
  }, [showToast]);

  if (!config) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--ink3)', letterSpacing: '2px' }}>LOADING…</div>
    </div>
  );

  const renderPage = () => {
    const customPage = config.customPages.find(p => p.id === activePage && p.visible);
    if (customPage) {
      return (
        <div className="page-fade" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem,4vw,4rem) clamp(1rem,3vw,2rem)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,38px)', marginBottom: '1.5rem' }}>{customPage.title}</h1>
          <div style={{ fontSize: '15px', color: 'var(--ink2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{customPage.content}</div>
        </div>
      );
    }

    switch (activePage) {
      case 'home': return <HomePage onNav={handleNav} onToast={showToast} branches={config.branches} />;
      case 'quantums': return <QuantumsPage onNav={handleNav} onToast={showToast} papers={config.papers} branches={config.branches} />;
      case 'notes': return <NotesPage onNav={handleNav} onToast={showToast} notes={config.notes} />;
      case 'syllabus': return <SyllabusPage syllabus={config.syllabus} />;
      case 'about': return <AboutPage />;
      case 'upload': return <UploadPage onToast={showToast} branches={config.branches} />;
      case 'admin': return <AdminPanel config={config} onConfigChange={handleConfigChange} onRefresh={handleRefreshConfig} onToast={showToast} isLoggedIn={adminLoggedIn} onLogin={handleAdminLogin} onLogout={handleAdminLogout} />;
      default: return <HomePage onNav={handleNav} onToast={showToast} branches={config.branches} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Topbar activePage={activePage} onNav={handleNav} theme={theme} themes={config.themes} onThemeChange={handleThemeChange} onToast={showToast} />
      <main style={{ flex: 1, paddingTop: '60px' }}>{renderPage()}</main>
      <Footer onNav={handleNav} onToast={showToast} />
      <Toast message={toastMsg} onClear={clearToast} />
    </div>
  );
}
