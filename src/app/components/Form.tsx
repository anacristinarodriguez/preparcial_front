'use client';

import React, { useState } from "react";
import styles from "../styles/Form.module.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema, {FormSchema } from "../validations/formSchema";


export default function Form()
 {
  
  // sirve para ir a otras paginas - para ir a authors después de crear uno nuevo
  const router = useRouter(); 

  // estados para cada campo del formulario 
  const { register, handleSubmit, formState: {errors, isSubmitting}} =
    useForm<FormSchema>({
      resolver: zodResolver (formSchema),
      mode: "onSubmit",
      defaultValues: {
        name: "", 
        description: "", 
        image: "", 
        birthDate: "",
      },
    })

    const onSubmit = async (values: FormSchema) => {

    try {
      const res = await fetch("http://127.0.0.1:8080/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        console.log("Autor creado exitosamente");
        router.push("/authors"); 
        router.refresh();
      } else {
        const errorText = await res.text();
        console.error("Error al crear el autor:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <main>
      <button className= {styles.btnVolver} onClick={() => router.push("/")}>Volver</button>
      <h2 className={styles.titulo}>Crear Autor</h2>

    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="name" className={styles.label}>Nombre del autor:</label>
        <input  
          id="name"  
          className={styles.input} 
          {...register("name")}   
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}

        <label htmlFor="birthDate" className={styles.label}>Fecha de nacimiento:</label>
        <input 
          type="date" 
          id="birthDate"  
          className={styles.input}
          {...register("birthDate")}                 
        />
        {errors.birthDate && <p className={styles.error}>{errors.birthDate.message}</p>}

        <label htmlFor="description" className={styles.label}>Descripción del autor:</label>
        <input         
          id="description"          
          className={styles.input}
          {...register("description")}    
        />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}

        <label htmlFor="image" className={styles.label}>Link a imagen del autor:</label>
        <input 
          id="image" 
          className={styles.input}
          {...register("image")}
          placeholder="https://…"
        />
        {errors.image && <p className={styles.error}>{errors.image.message}</p>}

        <div>
          <button type="submit" className={styles.btn}>Crear autor</button>
          {isSubmitting ? "Creando…" : "Crear autor"}
        </div> 
      </form>
    </div> 
    </main>
  );
}

