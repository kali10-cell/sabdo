
// --ANTES DE KEY 


// "use client";

// import { useState } from "react";

// export default function FormularioObjetos({
//   objetos,
//   setObjetos
// }) {

//   const [nombre, setNombre] = useState("");
//   const [rareza, setRareza] = useState("");
//   const [cantidad, setCantidad] = useState("");

//   const guardarObjeto = (e) => {

//     e.preventDefault();

//     const nuevoObjeto = {
//       id: Date.now(),
//       nombre: nombre,
//       rareza: rareza,
//       cantidad: Number(cantidad)
//     };

//     setObjetos([...objetos, nuevoObjeto]);

//     setNombre("");
//     setRareza("");
//     setCantidad("");
//   };

//   return (

//     <form onSubmit={guardarObjeto}>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={nombre}
//         onChange={(e) => setNombre(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Rareza"
//         value={rareza}
//         onChange={(e) => setRareza(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Cantidad"
//         value={cantidad}
//         onChange={(e) => setCantidad(e.target.value)}
//       />

//       <button type="submit">
//         Guardar
//       </button>

//     </form>
//   );
// }


"use client";

import { useState } from "react";

// NUEVO
// IMPORTAR SUPABASE
import { supabase } from "../utils/supabase/client";

export default function FormularioObjetos({
  objetos,
  setObjetos
}) {

  const [nombre, setNombre] = useState("");
  const [rareza, setRareza] = useState("");
  const [cantidad, setCantidad] = useState("");



  // CAMBIADO
  // ANTES:
  // const guardarObjeto = (e) => {

  // AHORA:
  // async PORQUE SUPABASE USA await
  const guardarObjeto = async (e) => {

    e.preventDefault();



    const nuevoObjeto = {

      // QUITADO
      // POSTGRESQL CREA EL ID SOLO

      // id: Date.now(),

      nombre: nombre,
      rareza: rareza,
      cantidad: Number(cantidad)
    };



    // QUITADO
    // SOLO GUARDABA EN MEMORIA

    // setObjetos([...objetos, nuevoObjeto]);



    // NUEVO
    // GUARDAR EN SUPABASE

    const { data, error } = await supabase

      // TABLA
      .from("objetos")

      // INSERTAR
      .insert([nuevoObjeto])

      // DEVOLVER OBJETO GUARDADO
      .select();



    // SI HAY ERROR
    if(error){

      console.log(error);

    } else {

      // AGREGAR A REACT
      setObjetos([...objetos, data[0]]);

    }



    // LIMPIAR INPUTS
    setNombre("");
    setRareza("");
    setCantidad("");
  };



  return (

    <form onSubmit={guardarObjeto}>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="text"
        placeholder="Rareza"
        value={rareza}
        onChange={(e) => setRareza(e.target.value)}
      />

      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />

      <button type="submit">
        Guardar
      </button>

    </form>
  );
}