// "use client";

// export default function ListaObjetos({
//   objetos,
//   setObjetos
// }) {

//   const eliminarObjeto = (id) => {

//     const objetosFiltrados = objetos.filter(
//       (objeto) => objeto.id !== id
//     );

//     setObjetos(objetosFiltrados);
//   };

//   const sumarCantidad = (id) => {

//     const objetosActualizados = objetos.map((objeto) =>

//       objeto.id === id
//         ? {
//             ...objeto,
//             cantidad: objeto.cantidad + 1
//           }
//         : objeto
//     );

//     setObjetos(objetosActualizados);
//   };

//   const restarCantidad = (id) => {

//     const objetosActualizados = objetos.map((objeto) =>

//       objeto.id === id
//         ? {
//             ...objeto,
//             cantidad: objeto.cantidad - 1
//           }
//         : objeto
//     );

//     setObjetos(objetosActualizados);
//   };

//   return (

//     <section>

//       {objetos.map((objeto) => (

//         <article key={objeto.id}>

//           <h2>{objeto.nombre}</h2>

//           <p>Rareza: {objeto.rareza}</p>

//           <p>Cantidad: {objeto.cantidad}</p>

//           <button onClick={() => sumarCantidad(objeto.id)}>
//             +1
//           </button>

//           <button onClick={() => restarCantidad(objeto.id)}>
//             -1
//           </button>

//           <button onClick={() => eliminarObjeto(objeto.id)}>
//             Eliminar
//           </button>

//         </article>

//       ))}

//     </section>
//   );
// }


"use client";

// NUEVO
// IMPORTAR SUPABASE
import { supabase } from "@/utils/supabase/client";

export default function ListaObjetos({
  objetos,
  setObjetos
}) {




  // CAMBIADO
  // ANTES:
  // const eliminarObjeto = (id) => {

  // AHORA:
  // async PORQUE USA SUPABASE

  const eliminarObjeto = async (id) => {



    // NUEVO
    // BORRAR EN SUPABASE

    const { error } = await supabase

      .from("objetos")

      .delete()

      .eq("id", id);



    // SI HAY ERROR
    if(error){

      console.log(error);

    } else {



      // ESTO YA ESTABA
      // BORRAR EN REACT

      const objetosFiltrados = objetos.filter(
        (objeto) => objeto.id !== id
      );

      setObjetos(objetosFiltrados);

    }

  };





  const sumarCantidad = (id) => {

    const objetosActualizados = objetos.map((objeto) =>

      objeto.id === id
        ? {
            ...objeto,
            cantidad: objeto.cantidad + 1
          }
        : objeto
    );

    setObjetos(objetosActualizados);
  };





  const restarCantidad = (id) => {

    const objetosActualizados = objetos.map((objeto) =>

      objeto.id === id
        ? {
            ...objeto,
            cantidad: objeto.cantidad - 1
          }
        : objeto
    );

    setObjetos(objetosActualizados);
  };





  return (

    <section>

      {objetos.map((objeto) => (

        <article key={objeto.id}>

          <h2>{objeto.nombre}</h2>

          <p>Rareza: {objeto.rareza}</p>

          <p>Cantidad: {objeto.cantidad}</p>

          <button onClick={() => sumarCantidad(objeto.id)}>
            +1
          </button>

          <button onClick={() => restarCantidad(objeto.id)}>
            -1
          </button>

          <button onClick={() => eliminarObjeto(objeto.id)}>
            Eliminar
          </button>

        </article>

      ))}

    </section>
  );
}