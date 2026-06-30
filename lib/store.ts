import { ThemeConfig, BranchConfig, PaperConfig, NoteConfig, BranchSyllabusConfig, SiteConfig } from './types';
import { api } from './api';

// ---- Default data (used as fallback when API is unavailable) ----

export const DEFAULT_THEMES: ThemeConfig[] = [
  { id: 'dark', label: 'Dark', preview: '#c8a96e', isDark: true },
  { id: 'light', label: 'Light', preview: '#8b5e1a', isDark: false },
  { id: 'midnight', label: 'Midnight', preview: '#8b6ef0', isDark: true },
  { id: 'forest', label: 'Forest', preview: '#6ec87a', isDark: true },
];

export const DEFAULT_BRANCHES: BranchConfig[] = [
  { code: 'CS', label: 'CS / IT', icon: '💻', dot: 'var(--green)', paperCount: 614 },
  { code: 'EC', label: 'Electronics', icon: '📡', dot: 'var(--blue)', paperCount: 490 },
  { code: 'ME', label: 'Mechanical', icon: '⚙️', dot: 'var(--accent)', paperCount: 388 },
  { code: 'CE', label: 'Civil', icon: '🏗️', dot: 'var(--red)', paperCount: 310 },
  { code: 'EE', label: 'Electrical', icon: '⚡', dot: '#a070e0', paperCount: 290 },
  { code: 'CH', label: 'Chemical', icon: '🧪', dot: '#30bcc0', paperCount: 208 },
];

export const DEFAULT_PAPERS: PaperConfig[] = [
  { id: 'p1', tag: 'CS · SEM 4', title: 'Theory of Computation', code: 'CS-401', year: '2024', size: '1.2 MB', branch: 'CS', semester: 4, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p2', tag: 'CS · SEM 4', title: 'Design & Analysis of Algorithms', code: 'CS-402', year: '2024', size: '980 KB', branch: 'CS', semester: 4, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p3', tag: 'CS · SEM 4', title: 'Database Management Systems', code: 'CS-403', year: '2024', size: '1.1 MB', branch: 'CS', semester: 4, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p4', tag: 'CS · SEM 5', title: 'Operating Systems', code: 'CS-501', year: '2024', size: '870 KB', branch: 'CS', semester: 5, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p5', tag: 'CS · SEM 5', title: 'Compiler Design', code: 'CS-502', year: '2024', size: '1.0 MB', branch: 'CS', semester: 5, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p6', tag: 'CS · SEM 6', title: 'Computer Networks', code: 'CS-601', year: '2023', size: '1.1 MB', branch: 'CS', semester: 6, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
  { id: 'p7', tag: 'EC · SEM 3', title: 'Analog Electronics', code: 'EC-301', year: '2024', size: '1.5 MB', branch: 'EC', semester: 3, color: 'rgba(79,156,240,.12)', textColor: 'var(--blue)' },
  { id: 'p8', tag: 'EC · SEM 4', title: 'Digital Signal Processing', code: 'EC-401', year: '2023', size: '1.3 MB', branch: 'EC', semester: 4, color: 'rgba(79,156,240,.12)', textColor: 'var(--blue)' },
  { id: 'p9', tag: 'ME · SEM 5', title: 'Fluid Mechanics', code: 'ME-501', year: '2024', size: '2.1 MB', branch: 'ME', semester: 5, color: 'rgba(200,169,110,.12)', textColor: 'var(--accent)' },
  { id: 'p10', tag: 'ME · SEM 4', title: 'Thermodynamics', code: 'ME-401', year: '2024', size: '1.8 MB', branch: 'ME', semester: 4, color: 'rgba(200,169,110,.12)', textColor: 'var(--accent)' },
  { id: 'p11', tag: 'CE · SEM 4', title: 'Structural Analysis', code: 'CE-401', year: '2023', size: '1.4 MB', branch: 'CE', semester: 4, color: 'rgba(224,90,90,.12)', textColor: 'var(--red)' },
  { id: 'p12', tag: 'CS · SEM 3', title: 'Data Structures', code: 'CS-301', year: '2024', size: '940 KB', branch: 'CS', semester: 3, color: 'rgba(61,186,126,.12)', textColor: 'var(--green)' },
];

export const DEFAULT_NOTES: NoteConfig[] = [
  { id: 'n1', icon: '📝', title: 'Operating Systems — Complete Handwritten Notes', branch: 'CS · Sem 5', branchColor: 'rgba(61,186,126,.12)', branchText: 'var(--green)', type: 'Handwritten', pages: '48 pages', size: '4.2 MB' },
  { id: 'n2', icon: '📄', title: 'DBMS — Unit 3 & 4 Short Notes (Typed)', branch: 'CS · Sem 4', branchColor: 'rgba(61,186,126,.12)', branchText: 'var(--green)', type: 'Typed PDF', pages: '22 pages', size: '1.8 MB' },
  { id: 'n3', icon: '📊', title: 'Fluid Mechanics — All Units Slides', branch: 'ME · Sem 5', branchColor: 'rgba(200,169,110,.12)', branchText: 'var(--accent)', type: 'Slides', pages: '120 slides', size: '8.4 MB' },
  { id: 'n4', icon: '📝', title: 'Analog Electronics — Handwritten (Complete)', branch: 'EC · Sem 3', branchColor: 'rgba(79,156,240,.12)', branchText: 'var(--blue)', type: 'Handwritten', pages: '60 pages', size: '6.1 MB' },
  { id: 'n5', icon: '📄', title: 'Data Structures — Typed Notes with Diagrams', branch: 'CS · Sem 3', branchColor: 'rgba(61,186,126,.12)', branchText: 'var(--green)', type: 'Typed PDF', pages: '35 pages', size: '2.3 MB' },
  { id: 'n6', icon: '📝', title: 'Theory of Computation — Quick Revision Notes', branch: 'CS · Sem 4', branchColor: 'rgba(61,186,126,.12)', branchText: 'var(--green)', type: 'Handwritten', pages: '18 pages', size: '2.0 MB' },
  { id: 'n7', icon: '📊', title: 'Computer Networks — Unit-wise PPT', branch: 'CS · Sem 6', branchColor: 'rgba(61,186,126,.12)', branchText: 'var(--green)', type: 'Slides', pages: '95 slides', size: '5.7 MB' },
  { id: 'n8', icon: '📄', title: 'Thermodynamics — Typed Concise Notes', branch: 'ME · Sem 4', branchColor: 'rgba(200,169,110,.12)', branchText: 'var(--accent)', type: 'Typed PDF', pages: '28 pages', size: '2.6 MB' },
];

export const DEFAULT_SYLLABUS: BranchSyllabusConfig[] = [
  { code: 'CS', name: 'Computer Science & Engineering', sub: 'B.Tech · AKTU · 8 Semesters · 160+ Subjects', dot: 'var(--green)', semesters: [
    { num: 'SEMESTER 1', count: '8 subjects', subjects: [{name:'Engineering Mathematics-I',code:'KAS-101'},{name:'Engineering Physics',code:'KAS-102'},{name:'Basics of Electrical Engg.',code:'KEE-101'},{name:'Programming for Problem Solving',code:'KCS-101'},{name:'Engineering Graphics',code:'KME-101'}] },
    { num: 'SEMESTER 2', count: '8 subjects', subjects: [{name:'Engineering Mathematics-II',code:'KAS-201'},{name:'Engineering Chemistry',code:'KAS-202'},{name:'Data Structures',code:'KCS-201'},{name:'Digital Electronics',code:'KEC-201'},{name:'Environment & Ecology',code:'KVE-201'}] },
    { num: 'SEMESTER 3', count: '7 subjects', subjects: [{name:'Discrete Mathematics',code:'KCS-301'},{name:'Computer Organisation',code:'KCS-302'},{name:'Object Oriented Programming',code:'KCS-303'},{name:'Software Engineering',code:'KCS-305'}] },
    { num: 'SEMESTER 4', count: '7 subjects', subjects: [{name:'Theory of Computation',code:'KCS-401'},{name:'Design of Algorithms',code:'KCS-402'},{name:'Database Mgmt. Systems',code:'KCS-403'},{name:'Microprocessors',code:'KCS-404'}] },
    { num: 'SEMESTER 5', count: '6 subjects', subjects: [{name:'Operating Systems',code:'KCS-501'},{name:'Compiler Design',code:'KCS-502'},{name:'Computer Graphics',code:'KCS-503'},{name:'Software Project Mgmt.',code:'KCS-504'}] },
    { num: 'SEMESTER 6', count: '6 subjects', subjects: [{name:'Computer Networks',code:'KCS-601'},{name:'Artificial Intelligence',code:'KCS-602'},{name:'Web Technology',code:'KCS-603'},{name:'Information Security',code:'KCS-604'}] },
  ]},
  { code: 'EC', name: 'Electronics & Communication Engg.', sub: 'B.Tech · AKTU · 8 Semesters · 140+ Subjects', dot: 'var(--blue)', semesters: [
    { num: 'SEMESTER 1', count: '8 subjects', subjects: [{name:'Engineering Mathematics-I',code:'KAS-101'},{name:'Basic Electronics',code:'KEC-101'}] },
    { num: 'SEMESTER 3', count: '7 subjects', subjects: [{name:'Signals & Systems',code:'KEC-301'},{name:'Analog Electronics',code:'KEC-302'},{name:'Electromagnetic Fields',code:'KEC-303'}] },
    { num: 'SEMESTER 4', count: '7 subjects', subjects: [{name:'Digital Signal Processing',code:'KEC-401'},{name:'Communication Systems',code:'KEC-402'}] },
  ]},
  { code: 'ME', name: 'Mechanical Engineering', sub: 'B.Tech · AKTU · 8 Semesters · 145+ Subjects', dot: 'var(--accent)', semesters: [
    { num: 'SEMESTER 1', count: '8 subjects', subjects: [{name:'Engineering Mathematics-I',code:'KAS-101'},{name:'Engineering Graphics',code:'KME-101'}] },
    { num: 'SEMESTER 4', count: '7 subjects', subjects: [{name:'Thermodynamics',code:'KME-401'},{name:'Machine Design',code:'KME-402'}] },
    { num: 'SEMESTER 5', count: '6 subjects', subjects: [{name:'Heat & Mass Transfer',code:'KME-501'},{name:'Manufacturing Technology',code:'KME-502'}] },
  ]},
];

// ---- Config loading: tries API first, falls back to defaults ----

export async function loadConfigFromAPI(): Promise<SiteConfig> {
  try {
    const config = await api.config.load();
    // Normalize backend responses to match frontend types
    const themes = config.themes.map((t: any) => ({
      _id: t.id,
      id: t.themeId || t.id,
      label: t.label,
      preview: t.preview,
      isDark: t.isDark,
      isCustom: t.isCustom,
      vars: t.vars,
    }));
    const branches = config.branches.map((b: any) => ({ ...b, _id: b.id }));
    const syllabus = config.syllabus.map((b: any) => ({
      code: b.code,
      name: b.name,
      sub: b.sub,
      dot: b.dot,
      semesters: (b.semesters || []).sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((s: any) => ({
        num: s.num,
        count: s.count,
        subjects: (s.subjects || []).map((sub: any) => ({ name: sub.name, code: sub.code })),
      })),
    }));
    return { ...config, themes, branches, syllabus };
  } catch {
    // API unavailable — return defaults
    return getDefault();
  }
}

export function getDefault(): SiteConfig {
  return {
    themes: DEFAULT_THEMES,
    branches: DEFAULT_BRANCHES,
    papers: DEFAULT_PAPERS,
    notes: DEFAULT_NOTES,
    syllabus: DEFAULT_SYLLABUS,
    customPages: [],
  };
}

// ---- Theme CSS helpers ----

export function generateThemeVars(accentHex: string, isDark: boolean): Record<string, string> {
  const r = parseInt(accentHex.slice(1,3),16);
  const g = parseInt(accentHex.slice(3,5),16);
  const b = parseInt(accentHex.slice(5,7),16);
  const lighter = (c: number, f: number) => Math.min(255, Math.round(c + (255-c)*f));
  const darker = (c: number, f: number) => Math.max(0, Math.round(c * (1-f)));

  if (isDark) {
    return {
      '--bg': '#0b0c0e', '--bg2': '#111316', '--bg3': '#161a1f', '--bg4': '#1c2028',
      '--ink': '#f0ede6', '--ink2': '#a09c94', '--ink3': '#5c5850',
      '--accent': accentHex,
      '--accent2': `rgb(${lighter(r,0.15)},${lighter(g,0.15)},${lighter(b,0.15)})`,
      '--green': '#3dba7e', '--blue': '#4f9cf0', '--red': '#e05a5a',
      '--bd': 'rgba(255,255,255,0.06)', '--bd2': 'rgba(255,255,255,0.094)',
      '--topbar-bg': 'rgba(11,12,14,0.92)', '--shadow': '0 8px 32px rgba(0,0,0,0.4)',
    };
  }
  return {
    '--bg': '#faf8f5', '--bg2': '#f0ece5', '--bg3': '#e6e1d8', '--bg4': '#d6d0c5',
    '--ink': '#1a1510', '--ink2': '#4a4540', '--ink3': '#7a756e',
    '--accent': `rgb(${darker(r,0.3)},${darker(g,0.3)},${darker(b,0.3)})`,
    '--accent2': `rgb(${darker(r,0.15)},${darker(g,0.15)},${darker(b,0.15)})`,
    '--green': '#1a7a44', '--blue': '#1a5a9a', '--red': '#a03030',
    '--bd': 'rgba(0,0,0,0.12)', '--bd2': 'rgba(0,0,0,0.18)',
    '--topbar-bg': 'rgba(250,248,245,0.94)', '--shadow': '0 8px 32px rgba(0,0,0,0.12)',
  };
}

export function applyCustomThemeVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function clearCustomThemeVars() {
  const root = document.documentElement;
  ['--bg','--bg2','--bg3','--bg4','--ink','--ink2','--ink3','--accent','--accent2','--green','--blue','--red','--bd','--bd2','--topbar-bg','--shadow'].forEach(k => root.style.removeProperty(k));
}
