'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Author {
  id: number;
  name: string;
  description: string;
  image: string;
  birthDate : string; 
}

interface UseAuthorsResult {
  authors: Author[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  createAuthor: (payload: Omit<Author, 'id'>) => Promise<Author>;
  updateAuthor: (id: number, payload: Partial<Omit<Author, 'id'>>) => Promise<Author>;
  deleteAuthor: (id: number) => Promise<void>;
  getAuthor: (id: number) => Promise<Author>;
}

const API = 'http://127.0.0.1:8080/api/authors';

export function useAuthors(): UseAuthorsResult {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Author[] = await res.json();
      setAuthors(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const createAuthor = useCallback(async (payload: Omit<Author, 'id'>) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error ${res.status} creando autor`);
    const created: Author = await res.json();
    setAuthors(prev => [created, ...prev]);
    router.refresh();
    return created;
  }, [router]);

  const updateAuthor = useCallback(async (id: number, payload: Partial<Omit<Author, 'id'>>) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Error ${res.status} actualizando autor`);
    const updated: Author = await res.json();
    setAuthors(prev => prev.map(a => (a.id === id ? updated : a)));
    router.refresh();
    return updated;
  }, [router]);

  const deleteAuthor = useCallback(async (id: number) => {
    const prev = authors;
    setAuthors(p => p.filter(a => a.id !== id)); // optimistic
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setAuthors(prev); // rollback
      const txt = await res.text();
      throw new Error(`Error ${res.status}: ${txt || 'No se pudo eliminar'}`);
    }
    router.refresh();
  }, [authors, router]);

  const getAuthor = useCallback(async (id: number) => {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status} obteniendo autor`);
    return res.json();
  }, []);

  return { authors, loading, error, reload: fetchAuthors, createAuthor, updateAuthor, deleteAuthor, getAuthor };
}
