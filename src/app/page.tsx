import Image from "next/image";
import AuthorList from "./components/Authors";
import Link from "next/link";
import StyleSheet from './styles/Home.module.css';

export default function Home() {
  return (
    <main>
      <div className={StyleSheet.container}>
        <Link href="/authors">
          <button className={StyleSheet.btn}>
            Ver Autores
          </button>
        </Link>
        <Link href="/crear">
          <button className={StyleSheet.btn}>
            Crear Autor
          </button>
        </Link>
      </div>  
    </main>
  );
}

