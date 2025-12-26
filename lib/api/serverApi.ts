import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

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

async function getHeaders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    Cookie: cookieHeader,
  };
}

export const fetchNotes = async (params?: FetchNotesParams): Promise<NotesResponse> => {
  const headers = await getHeaders();
  const response = await api.get('/notes', {
    params,
    headers,
  });
  return response.data as NotesResponse;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getHeaders();
  const response = await api.get(`/notes/${id}`, { headers });
  return response.data as Note;
};

export const getMe = async (): Promise<User> => {
  const headers = await getHeaders();
  const response = await api.get('/users/me', { headers });
  return response.data as User;
};

export const checkSession = async () => {
  const headers = await getHeaders();
  const response = await api.get('/auth/session', { headers });
  return response;
};