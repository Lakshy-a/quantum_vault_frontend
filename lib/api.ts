import { getToken } from './auth';
import type {
  BranchConfig, PaperConfig, NoteConfig, BranchSyllabusConfig,
  ThemeConfig, CustomPageConfig, SiteConfig, SubmissionConfig,
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/** Resolve a stored fileUrl to an absolute link. Local uploads are saved as
 *  `/uploads/<file>` on the backend origin (outside the `/api` prefix). */
export function fileHref(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return BASE.replace(/\/api\/?$/, '') + url;
}

// --- Low-level fetch helpers ---

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const get = <T>(path: string) => req<T>(path);
const post = <T>(path: string, body?: unknown) => req<T>(path, { method: 'POST', body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown) => req<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
const del = <T>(path: string) => req<T>(path, { method: 'DELETE' });

// --- Response shapes from backend ---

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaperQuery {
  search?: string;
  branch?: string;
  semester?: number;
  year?: string;
  page?: number;
  limit?: number;
}

export interface NoteQuery {
  search?: string;
  type?: string;
  branch?: string;
  page?: number;
  limit?: number;
}

// --- Request payloads (must match backend DTOs exactly — the API rejects unknown fields) ---

export interface ThemeInput {
  themeId: string;
  label: string;
  preview: string;
  isDark?: boolean;
  vars?: Record<string, string>;
}

export interface BranchInput {
  code: string;
  label: string;
  icon?: string;
  dot?: string;
  paperCount?: number;
  sortOrder?: number;
}

export interface PaperInput {
  title: string;
  code: string;
  branch: string;
  semester: number;
  year: string;
  color?: string;
  textColor?: string;
  size?: string;
  fileUrl?: string;
}

export interface NoteInput {
  title: string;
  branch: string;
  type: string;
  pages?: string;
  branchColor?: string;
  branchText?: string;
  size?: string;
  fileUrl?: string;
}

export interface ApproveSubmissionInput {
  kind: 'paper' | 'note';
  title: string;
  branch: string;
  // paper
  code?: string;
  semester?: number;
  year?: string;
  // note
  noteType?: string;
  pages?: string;
}

export interface CredentialsInput {
  currentPassword: string;
  newAdminId?: string;
  newPassword?: string;
}

// --- Auth ---

export const api = {
  auth: {
    login: (adminId: string, password: string) =>
      post<{ access_token: string; expires_in: string }>('/auth/login', { adminId, password }),
    /** Returns a fresh token — older tokens stop working after this call. */
    updateCredentials: (data: CredentialsInput) =>
      patch<{ access_token: string; expires_in: string }>('/auth/credentials', data),
  },

  // --- Branches ---
  branches: {
    list: () => get<BranchConfig[]>('/branches'),
    create: (data: BranchInput) => post<BranchConfig & { id: number }>('/branches', data),
    update: (id: number, data: Partial<BranchInput>) => patch<BranchConfig>(`/branches/${id}`, data),
    remove: (id: number) => del<{ deleted: boolean }>(`/branches/${id}`),
  },

  // --- Papers ---
  papers: {
    list: (query: PaperQuery = {}) => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
      return get<Paginated<PaperConfig>>(`/papers?${params}`);
    },
    get: (id: string) => get<PaperConfig>(`/papers/${id}`),
    create: (data: PaperInput) => post<PaperConfig>('/papers', data),
    update: (id: string, data: Partial<PaperInput>) => patch<PaperConfig>(`/papers/${id}`, data),
    remove: (id: string) => del<{ deleted: boolean }>(`/papers/${id}`),
    download: (id: string) => post<void>(`/papers/${id}/download`),
  },

  // --- Notes ---
  notes: {
    list: (query: NoteQuery = {}) => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
      return get<Paginated<NoteConfig>>(`/notes?${params}`);
    },
    get: (id: string) => get<NoteConfig>(`/notes/${id}`),
    create: (data: NoteInput) => post<NoteConfig>('/notes', data),
    update: (id: string, data: Partial<NoteInput>) => patch<NoteConfig>(`/notes/${id}`, data),
    remove: (id: string) => del<{ deleted: boolean }>(`/notes/${id}`),
    download: (id: string) => post<void>(`/notes/${id}/download`),
  },

  // --- Syllabus ---
  syllabus: {
    list: () => get<BranchSyllabusConfig[]>('/syllabus'),
    get: (code: string) => get<BranchSyllabusConfig>(`/syllabus/${code}`),
    createBranch: (data: Partial<BranchSyllabusConfig>) => post<BranchSyllabusConfig>('/syllabus', data),
    removeBranch: (id: number) => del<{ deleted: boolean }>(`/syllabus/${id}`),
    addSubject: (semesterId: number, name: string, code: string) =>
      post<{ id: number; name: string; code: string }>('/syllabus/subjects', { semesterId, name, code }),
    removeSubject: (id: number) => del(`/syllabus/subjects/${id}`),
  },

  // --- Themes ---
  themes: {
    list: () => get<ThemeConfig[]>('/themes'),
    create: (data: ThemeInput) => post<ThemeInput & { id: number }>('/themes', data),
    remove: (id: number) => del<{ deleted: boolean }>(`/themes/${id}`),
  },

  // --- Custom Pages ---
  pages: {
    list: (includeHidden = false) =>
      get<CustomPageConfig[]>(`/pages${includeHidden ? '?all=true' : ''}`),
    get: (id: string) => get<CustomPageConfig>(`/pages/${id}`),
    create: (data: Partial<CustomPageConfig>) => post<CustomPageConfig>('/pages', data),
    update: (id: string, data: Partial<CustomPageConfig>) => patch<CustomPageConfig>(`/pages/${id}`, data),
    remove: (id: string) => del<{ deleted: boolean }>(`/pages/${id}`),
  },

  // --- Community submissions (admin review queue) ---
  submissions: {
    list: (status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending') =>
      get<SubmissionConfig[]>(`/submissions?status=${status}`),
    approve: (id: string, data: ApproveSubmissionInput) =>
      post<{ submission: SubmissionConfig; item: PaperConfig | NoteConfig }>(`/submissions/${id}/approve`, data),
    reject: (id: string) => post<SubmissionConfig>(`/submissions/${id}/reject`),
    remove: (id: string) => del<{ deleted: boolean }>(`/submissions/${id}`),
  },

  // --- Uploads ---
  uploads: {
    uploadFile: async (file: File): Promise<{ url: string; sizeLabel: string; filename: string }> => {
      const token = getToken();
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${BASE}/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Upload failed');
      return res.json();
    },
    submit: async (file: File, meta: {
      subject: string; branch: string; semester: string; year: string; type: string; code?: string;
    }) => {
      const form = new FormData();
      form.append('file', file);
      Object.entries(meta).forEach(([k, v]) => v && form.append(k, v));
      const res = await fetch(`${BASE}/uploads/submit`, { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Submit failed');
      return res.json();
    },
  },

  // --- Full site config (all resources bundled) ---
  config: {
    load: async (): Promise<SiteConfig> => {
      const [themes, branches, papers, notes, syllabus, pages] = await Promise.all([
        api.themes.list(),
        api.branches.list(),
        api.papers.list({ limit: 100 }).then(r => r.data),
        api.notes.list({ limit: 100 }).then(r => r.data),
        api.syllabus.list(),
        api.pages.list(false),
      ]);
      return { themes, branches, papers, notes, syllabus, customPages: pages };
    },
  },
};
