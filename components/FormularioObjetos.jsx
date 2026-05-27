
/*
APUNTE IMPORTANTE (para examen):

En React/Next, "pintar en pantalla" siempre significa:
1) Guardas datos en estado (useState o store de Zustand)
2) Renderizas ese estado en JSX (map, h2/p, etc)

Version "ANTES de API / Supabase" (solo UI local con useState):

  "use client";
  import { useState } from "react";

  export default function FormularioObjetos({ objetos, setObjetos }) {
    const [nombre, setNombre] = useState("");
    const [rareza, setRareza] = useState("");
    const [cantidad, setCantidad] = useState("");

    const guardarObjeto = (e) => {
      e.preventDefault();

      const nuevoObjeto = {
        id: Date.now(),
        nombre,
        rareza,
        cantidad: Number(cantidad),
      };

      // Esto "pinta" porque cambia el estado:
      setObjetos([...objetos, nuevoObjeto]);
    };

    return <form onSubmit={guardarObjeto}>...</form>;
  }

Version "CON API / Supabase":
- El formulario llama a una funcion async (store) que hace INSERT/UPDATE.
- Cuando vuelve la respuesta, actualizas el store (items) y React re-renderiza.

En este proyecto lo dejamos generico, por eso FormularioObjetos ahora re-exporta CrudForm.
*/

// Backward compatible re-export (old name used "objetos").
// Prefer importing `CrudForm` from "@/components/CrudForm".
export { default } from "@/components/CrudForm";
