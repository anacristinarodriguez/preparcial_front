'use client';

import React, { useEffect, useState } from "react";
import styles from "../styles/Authors.module.css";
import { useRouter } from "next/navigation";

interface AuthorsProps{
  id: number;
  name: string;
  description: string;
  image: string;
}

const AuthorList = () => {
  const [authors, setAuthors] = useState<AuthorsProps[]>([]);
  const router = useRouter();


  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/authors")
      .then((response) => response.json())
      .then((data) => setAuthors(data));
  }, []);

  const Delete = async (id: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/authors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAuthors((prev) => prev.filter((a) => a.id !== id));
        router.refresh();
      } else {
        const errorText = await res.text();
        console.error("Error al eliminar el autor:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <main style={{ minHeight: '100dvh' }}>
      <div className={styles.lista}>
        <div>
          <button
            className={styles.btn}
            onClick={() => router.push("/", { scroll: true })}
          >
            Volver
          </button>
          <h2 className={styles.titulo}>Lista de Autores</h2>
        </div>

        <ul>
          {authors.map((a) => (
            <li key={a.id} className={styles.autor}>
              <img
                src={a.image}
                alt={`Foto de ${a.name}`}
                width={120}
                height={120}
                className={styles.fotos}
              />
              <div className={styles.info}>
                <h3 className={styles.nombre}>{a.name}</h3>
                <p>{a.description}</p>
              </div>
              <div className={styles.botones}>
                <button
                  className={styles.btnEditar}
                  onClick={() => router.push(`/authors/${a.id}/edit`, { scroll: true })}
                >
                  Editar
                </button>

                <button
                  className={styles.btnEliminar}
                  onClick={() => Delete(a.id)}
                >
                  X Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default AuthorList;
