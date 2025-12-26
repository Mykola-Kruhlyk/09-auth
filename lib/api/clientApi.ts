import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface UpdateProfilePayload {
  username: string;
}

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const login = async (payload: { email: string; password: string }): Promise<User> => {
  const res = await api.post('/auth/login', payload);
  return res.data as User;
};

export const register = async (payload: { email: string; password: string }): Promise<User> => {
  const res = await api.post('/auth/register', payload);
  return res.data as User;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getSession = async (): Promise<User | null> => {
  try {
    const res = await api.get('/auth/session');
    return res.data || null;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data as User;
};

export const updateMe = async (payload: UpdateProfilePayload): Promise<User> => {
  const res = await api.patch('/users/me', payload);
  return res.data as User;
};

export const fetchNotes = async (params?: FetchNotesParams): Promise<NotesResponse> => {
  const res = await api.get('/notes', { params });
  return res.data as NotesResponse;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get(`/notes/${id}`);
  return res.data as Note;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const res = await api.post('/notes', payload);
  return res.data as Note;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete(`/notes/${id}`);
  return res.data as Note;
};