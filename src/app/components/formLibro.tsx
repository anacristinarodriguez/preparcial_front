'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


type NewBook = {
  name: string;
  isbn: string;
  image: string;
  description: string;
  editorial:string;
};

const FormLibro: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<NewBook>({
    name: '',
    isbn: '',
    image: '',
    description: '',
    editorial: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    
      const res = await fetch('http://127.0.0.1:8080/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(
          Object.entries(form).filter(([_, v]) => v !== '' && v !== undefined)
        )),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error creando libro: ${res.status} - ${txt}`);
      }

      const created = await res.json(); // Debe regresar {id, name, ...}
      const bookId = created.id;

      
      router.push(`/authors/new?bookId=${bookId}`);
    } catch (err: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">Crear Libro</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">Título *</label>
        <input id="name" required className="w-full border p-2 rounded" value={form.name} onChange={onChange} />
      </div>

       <div>
          <label htmlFor="isbn" className="block text-sm font-medium">ISBN</label>
          <input id="isbn" className="w-full border p-2 rounded" value={form.isbn ?? ''} onChange={onChange} />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">Imagen</label>
          <input id="isbn" className="w-full border p-2 rounded" value={form.image ?? ''} onChange={onChange} />
        </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
        <textarea id="description" required className="w-full border p-2 rounded" value={form.description} onChange={onChange} />
      </div>

      <div>
        <label htmlFor="editorial" className="block text-sm font-medium">Editorial</label>
        <input id="image" required className="w-full border p-2 rounded" value={form.image} onChange={onChange} />
      </div>

       


      {error && <p className="text-red-600">{error}</p>}

      <button disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Guardando…' : 'Guardar libro y continuar →'}
      </button>
    </form>
  );
};

export default FormLibro;
