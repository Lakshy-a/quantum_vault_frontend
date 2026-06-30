import { getToken } from './auth';
import type {
  BranchConfig, PaperConfig, NoteConfig, BranchSyllabusConfig,
  ThemeConfig, CustomPageConfig, SiteConfig,
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

// --- Auth ---

export const api = {
  auth: {
    login: (adminId: string, password: string) =>
      post<{ access_token: string; expires_in: string }>('/auth/login', { adminId, password }),
    changePassword: (newPassword: string) =>
      patch<void>('/auth/password', { newPassword }),
  },

  // --- Branches ---
  branches: {
    list: () => get<BranchConfig[]>('/branches'),
    create: (data: Partial<BranchConfig>) => post<BranchConfig>('/branches', data),
    update: (id: number, data: Partial<BranchConfig>) => patch<BranchConfig>(`/branches/${id}`, data),
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
    create: (data: Partial<PaperConfig>) => post<PaperConfig>('/papers', data),
    update: (id: string, data: Partial<PaperConfig>) => patch<PaperConfig>(`/papers/${id}`, data),
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
    create: (data: Partial<NoteConfig>) => post<NoteConfig>('/notes', data),
    update: (id: string, data: Partial<NoteConfig>) => patch<NoteConfig>(`/notes/${id}`, data),
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
      post('/syllabus/subjects', { semesterId, name, code }),
    removeSubject: (id: number) => del(`/syllabus/subjects/${id}`),
  },

  // --- Themes ---
  themes: {
    list: () => get<ThemeConfig[]>('/themes'),
    create: (data: Partial<ThemeConfig>) => post<ThemeConfig>('/themes', data),
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
      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed');
      return res.json();
    },
    submit: async (file: File, meta: {
      subject: string; branch: string; semester: string; year: string; type: string; code?: string;
    }) => {
      const form = new FormData();
      form.append('file', file);
      Object.entries(meta).forEach(([k, v]) => v && form.append(k, v));
      const res = await fetch(`${BASE}/uploads/submit`, { method: 'POST', body: form });
      if (!res.ok) throw new Error((await res.json()).message || 'Submit failed');
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
