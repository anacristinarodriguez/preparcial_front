'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LibroProps {
  id: number;           
  name: string;         
  isbn: string;         
  image: string;        
  description: string;  
  editorial: string;    
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080";

const BookList = () => {
  
  const [books, setBooks] = useState<LibroProps[]>([]);
  const router = useRouter();


  useEffect(() => {
    fetch('${API_BASE}/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error cargando libros:", err));
  }, []);

  return (
    <main style={{ minHeight: "100dvh" }}>
      <div className="container">
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/", { scroll: true })}
          >
            Volver
          </button>
          <h2>Lista de Libros</h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {books.map((book) => (
            <li key={book.id} className="card p-4 border rounded shadow">
              <img
                src={book.image}
                alt={`Portada de ${book.name}`}
                width={120}
                height={160}
                className="mx-auto"
              />
              <div className="mt-2">
                <h3 className="font-bold">{book.name}</h3>
                <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                <p className="text-sm">{book.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Editorial: {book.editorial}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default BookList;
