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

const BookList = () => {
  
  const [books, setBooks] = useState<LibroProps[]>([]);
  const router = useRouter();


  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/books")
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
