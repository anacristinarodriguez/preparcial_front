import {z} from 'zod';

const formSchema = z.object({

    //Name
    name : z.string().min(3, {
        message: 'el nombre debe ser de mínimo 3 caracteres'
    }). max(200,{
        message: 'el ombre no puede tenr más de 200 caracteres'
    }
    ),

    //Description
    description : z.string().min(5, {
        message: 'La descripción debe tener mínimo 5 caracteres'
    }). max(500, {
        message : 'La descripción no puede tener más de 500 caracteres'
    }), 

    //URL image
    image: z.string()
        .url({message: "Ingresa una url válida"    
    }),

    //Birthdate
    birthDate: z.string()
  .refine(v => !Number.isNaN(Date.parse(v)), {
    message: "Fecha inválida",
  }),
  
});

export default formSchema;
export type FormSchema = z.infer<typeof formSchema>;