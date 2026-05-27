/*
APUNTE IMPORTANTE (para examen):

La lista "pinta" cuando hace map del estado:

  {objetos.map((obj) => (
    <article key={obj.id}>
      <h2>{obj.nombre}</h2>
    </article>
  ))}

Version "ANTES de API / Supabase":
- el estado vive en app/page.jsx con useState([...])
- ListaObjetos recibe props: objetos, setObjetos

Version "CON API / Supabase":
- el estado vive en un store (Zustand)
- ListaObjetos lee del store y llama acciones (fetchAll, deleteOne, etc)

En este proyecto lo dejamos generico, por eso ListaObjetos ahora re-exporta CrudList.
*/

// Backward compatible re-export (old name used "objetos").
// Prefer importing `CrudList` from "@/components/CrudList".
export { default } from "@/components/CrudList";
