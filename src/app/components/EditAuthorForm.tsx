// src/app/components/EditAuthorForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuthors, Author } from '../hooks/useAuthors';
import { useRouter } from 'next/navigation';
import styles from '../styles/Form.module.css';

type EditAuthorFormProps = { id: number };

export default function EditAuthorForm({ id }: EditAuthorFormProps) {
  const router = useRouter();
  const { getAuthor, updateAuthor } = useAuthors();

  const [form, setForm] = useState<Author>({
    id,
    name: '',
    description: '',
    image: '',
    birthDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAuthor(id);
        setForm({
          id: data.id,
          name: data.name ?? '',
          description: data.description ?? '',
          image: data.image ?? '',
          birthDate: data.birthDate ?? '',
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [getAuthor, id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAuthor(id, {
        name: form.name,
        description: form.description,
        image: form.image,
        birthDate: form.birthDate,
      });
      router.push('/authors');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.titulo}>Cargando autor…</p>;
  if (error) return (
    <div>
      <p className={styles.titulo}>Error: {error}</p>
      <button className={styles.btnVolver} onClick={() => router.push('/authors')}>Volver</button>
    </div>
  );

  return (
    <main>
      <button className={styles.btnVolver} onClick={() => router.push('/authors')}>Volver</button>
      <h2 className={styles.titulo}>Editar Autor</h2>
      <div className={styles.container}>
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className={styles.label}>Nombre del autor:</label>
          <input id="name" name="name" className={styles.input} required value={form.name} onChange={onChange} />

          <label htmlFor="birthDate" className={styles.label}>Fecha de nacimiento:</label>
          <input type="date" id="birthDate" name="birthDate" className={styles.input} value={form.birthDate || ''} onChange={onChange} />

          <label htmlFor="description" className={styles.label}>Descripción del autor:</label>
          <input id="description" name="description" className={styles.input} required value={form.description} onChange={onChange} />

          <label htmlFor="image" className={styles.label}>Link a imagen del autor:</label>
          <input id="image" name="image" className={styles.input} required value={form.image} onChange={onChange} />

          <div>
            <button type="submit" className={styles.btn} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

