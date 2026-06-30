export type Page = 'home' | 'quantums' | 'notes' | 'syllabus' | 'about' | 'upload' | 'admin';
export type Theme = 'dark' | 'light' | 'midnight' | 'forest' | string;

export interface ThemeVars {
  bg: string;
  bg2: string;
  bg3: string;
  bg4: string;
  ink: string;
  ink2: string;
  ink3: string;
  accent: string;
  accent2: string;
  green: string;
  blue: string;
  red: string;
}

export interface ThemeConfig {
  _id?: number;
  id: string;
  label: string;
  preview: string;
  isCustom?: boolean;
  isDark?: boolean;
  vars?: Partial<ThemeVars>;
}

export interface BranchConfig {
  _id?: number;
  code: string;
  label: string;
  icon: string;
  dot: string;
  paperCount: number;
}

export interface PaperConfig {
  id: string;
  tag: string;
  title: string;
  code: string;
  year: string;
  size: string;
  branch: string;
  semester: number;
  color: string;
  textColor: string;
}

export interface NoteConfig {
  id: string;
  icon: string;
  title: string;
  branch: string;
  branchColor: string;
  branchText: string;
  type: string;
  pages: string;
  size: string;
}

export interface SemesterConfig {
  num: string;
  count: string;
  subjects: { name: string; code: string }[];
}

export interface BranchSyllabusConfig {
  code: string;
  name: string;
  sub: string;
  dot: string;
  semesters: SemesterConfig[];
}

export interface SiteConfig {
  themes: ThemeConfig[];
  branches: BranchConfig[];
  papers: PaperConfig[];
  notes: NoteConfig[];
  syllabus: BranchSyllabusConfig[];
  customPages: CustomPageConfig[];
  adminPassword?: string;
}

export interface CustomPageConfig {
  id: string;
  title: string;
  navLabel: string;
  content: string;
  visible: boolean;
}
