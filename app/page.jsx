// "use client";

// import { useState } from "react";

// import FormularioObjetos from "@/components/FormularioObjetos";
// import ListaObjetos from "@/components/ListaObjetos";

// export default function Home() {

//   const [objetos, setObjetos] = useState([]);

//   return (
//     <main>

//       <h1>Inventario mágico</h1>

//       <FormularioObjetos
//         objetos={objetos}
//         setObjetos={setObjetos}
//       />

//       <ListaObjetos
//         objetos={objetos}
//         setObjetos={setObjetos}
//       />

//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";

// NUEVO
// IMPORTAR SUPABASE
import { supabase } from "@/utils/supabase/client";

import FormularioObjetos from "@/components/FormularioObjetos";
import ListaObjetos from "@/components/ListaObjetos";

export default function Home() {

  const [objetos, setObjetos] = useState([]);




  // NUEVO
  // CUANDO CARGA LA PAGINA
  // TRAER OBJETOS DE SUPABASE

  useEffect(() => {

    obtenerObjetos();

  }, []);




  // NUEVO
  // SELECT * FROM objetos

  const obtenerObjetos = async () => {

    const { data, error } = await supabase

      .from("objetos")

      .select("*");



    // SI HAY ERROR
    if(error){

      console.log(error);

    } else {

      // GUARDAR DATOS EN REACT
      setObjetos(data);

    }

  };




  return (
    <main>

      <h1>Inventario mágico</h1>

      <FormularioObjetos
        objetos={objetos}
        setObjetos={setObjetos}
      />

      <ListaObjetos
        objetos={objetos}
        setObjetos={setObjetos}
      />

    </main>
  );
}