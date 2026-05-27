# Guia paso a paso del examen

Esta guia explica el examen desde cero, de forma sencilla.

La idea del ejercicio es hacer una aplicacion con:

- Next.js para la interfaz.
- Supabase para guardar los datos.
- PostgreSQL para la tabla, la funcion, el trigger y las politicas RLS.

## 1. Que hay que hacer

El examen pide una aplicacion CRUD de cursos.

CRUD significa:

- Create: crear cursos.
- Read: leer o listar cursos.
- Update: actualizar cursos.
- Delete: eliminar cursos.

La tabla se llama:

```txt
cursos
```

Y debe tener estos campos:

- `id`
- `nombre`
- `modalidad`
- `horas`
- `created_at`
- `updated_at`

## 2. Crear la tabla en Supabase

En Supabase tienes que ir al SQL Editor y ejecutar este codigo.

```sql
create table if not exists public.cursos (
  id bigint generated always as identity primary key,
  nombre text not null,
  modalidad text not null default 'presencial'
    check (modalidad in ('presencial', 'online')),
  horas integer not null check (horas > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
```

Explicacion facil:

- `id`: numero automatico para identificar cada curso.
- `nombre`: nombre del curso.
- `modalidad`: puede ser `presencial` u `online`.
- `horas`: cantidad de horas del curso.
- `created_at`: fecha en la que se creo el curso.
- `updated_at`: fecha en la que se modifico el curso.

## 3. Crear la funcion del trigger

El examen pide que cuando se modifique un curso, se actualice automaticamente el campo `updated_at`.

Para eso primero se crea una funcion.

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Explicacion facil:

- `set_updated_at()` es el nombre de la funcion.
- `returns trigger` significa que esta funcion se usa con un trigger.
- `new.updated_at = now();` pone la fecha actual en `updated_at`.
- `return new;` devuelve la fila modificada.

## 4. Crear el trigger

La funcion sola no se ejecuta automaticamente.

Por eso hace falta un trigger.

```sql
drop trigger if exists trg_set_updated_at on public.cursos;

create trigger trg_set_updated_at
before update on public.cursos
for each row
execute function public.set_updated_at();
```

Explicacion facil:

- `before update`: se ejecuta antes de actualizar un curso.
- `on public.cursos`: funciona sobre la tabla `cursos`.
- `for each row`: se ejecuta por cada fila modificada.
- `execute function`: llama a la funcion `set_updated_at()`.

## 5. Activar RLS y crear politicas

En Supabase existe algo llamado RLS.

RLS significa Row Level Security.

Si RLS esta activado y no tienes politicas, la app no podra leer ni modificar datos.

Para este examen, como no hay login, se crean politicas abiertas para el rol `anon`.

```sql
alter table public.cursos enable row level security;

drop policy if exists "permitir leer cursos" on public.cursos;
drop policy if exists "permitir insertar cursos" on public.cursos;
drop policy if exists "permitir actualizar cursos" on public.cursos;
drop policy if exists "permitir eliminar cursos" on public.cursos;

create policy "permitir leer cursos"
on public.cursos
for select
to anon
using (true);

create policy "permitir insertar cursos"
on public.cursos
for insert
to anon
with check (true);

create policy "permitir actualizar cursos"
on public.cursos
for update
to anon
using (true)
with check (true);

create policy "permitir eliminar cursos"
on public.cursos
for delete
to anon
using (true);
```

Explicacion facil:

- La politica de `select` permite ver cursos.
- La politica de `insert` permite crear cursos.
- La politica de `update` permite editar cursos.
- La politica de `delete` permite borrar cursos.
- `to anon` significa que funciona con la clave anonima de Supabase.
- `using (true)` significa que permite acceder a las filas.
- `with check (true)` significa que permite guardar los datos.

Importante:

Estas politicas sirven para el examen, pero en una aplicacion real serian demasiado abiertas.

## 6. Crear el archivo `.env.local`

En la raiz del proyecto debe existir un archivo llamado:

```txt
.env.local
```

Dentro debe tener:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

Explicacion facil:

- `NEXT_PUBLIC_SUPABASE_URL`: es la URL de tu proyecto de Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: es la clave anonima de Supabase.

Se usa `NEXT_PUBLIC_` porque el cliente de Supabase se usa desde el navegador.

## 7. Instalar dependencias

El proyecto necesita Supabase y Zustand.

Comando:

```bash
npm install @supabase/supabase-js zustand
```

Explicacion facil:

- `@supabase/supabase-js`: permite conectar Next.js con Supabase.
- `zustand`: permite crear un store para guardar cursos y funciones.

## 8. Crear el cliente de Supabase

Archivo:

```txt
supabase/client.js
```

Codigo:

```jsx
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Explicacion facil:

Este archivo crea la conexion con Supabase.

Luego se puede importar `supabase` en otros archivos para hacer consultas.

## 9. Crear el store de cursos

Archivo:

```txt
store/useCursoStorage.js
```

Este archivo guarda las funciones principales del CRUD.

Codigo:

```jsx
"use client";

import { create } from "zustand";
import { supabase } from "@/supabase/client";

export const useCursoStorage = create((set) => ({
  cursos: [],
  error: null,
  loading: false,

  fetchCursos: async () => {
    set({ error: null, loading: true });

    const { data, error } = await supabase
      .from("cursos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({ cursos: data ?? [], loading: false });
  },

  insertarCurso: async (nuevoCurso) => {
    set({ error: null, loading: true });

    const { data, error } = await supabase
      .from("cursos")
      .insert(nuevoCurso)
      .select()
      .single();

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set((state) => ({
      cursos: [data, ...state.cursos],
      loading: false,
    }));
  },

  eliminarCurso: async (cursoId) => {
    set({ error: null, loading: true });

    const { error } = await supabase.from("cursos").delete().eq("id", cursoId);

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set((state) => ({
      cursos: state.cursos.filter((curso) => curso.id !== cursoId),
      loading: false,
    }));
  },

  editarCurso: async (cursoEditado) => {
    set({ error: null, loading: true });

    const { data, error } = await supabase
      .from("cursos")
      .update({
        nombre: cursoEditado.nombre,
        modalidad: cursoEditado.modalidad,
        horas: cursoEditado.horas,
      })
      .eq("id", cursoEditado.id)
      .select()
      .single();

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set((state) => ({
      cursos: state.cursos.map((curso) => (curso.id === data.id ? data : curso)),
      loading: false,
    }));
  },
}));
```

Explicacion facil:

- `cursos`: guarda la lista de cursos.
- `error`: guarda errores si algo falla.
- `loading`: indica si se esta cargando.
- `fetchCursos`: lee cursos.
- `insertarCurso`: crea cursos.
- `eliminarCurso`: borra cursos.
- `editarCurso`: actualiza cursos.

## 10. Crear el formulario

Archivo:

```txt
components/InputCursos.jsx
```

Este componente sirve para crear cursos.

Como usa `useState`, necesita:

```jsx
"use client";
```

Codigo:

```jsx
"use client";

import { useState } from "react";
import { useCursoStorage } from "@/store/useCursoStorage";

const estadoInicial = {
  nombre: "",
  modalidad: "presencial",
  horas: "",
};

export default function InputCursos() {
  const [formulario, setFormulario] = useState(estadoInicial);
  const { insertarCurso, loading } = useCursoStorage();

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((estado) => ({
      ...estado,
      [name]: value,
    }));
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    if (!formulario.nombre.trim() || !formulario.horas) return;

    await insertarCurso({
      nombre: formulario.nombre.trim(),
      modalidad: formulario.modalidad,
      horas: Number(formulario.horas),
    });

    setFormulario(estadoInicial);
  };

  return (
    <form onSubmit={manejarSubmit}>
      <input
        name="nombre"
        value={formulario.nombre}
        onChange={manejarCambio}
        placeholder="Nombre del curso"
        required
      />

      <select
        name="modalidad"
        value={formulario.modalidad}
        onChange={manejarCambio}
      >
        <option value="presencial">Presencial</option>
        <option value="online">Online</option>
      </select>

      <input
        name="horas"
        type="number"
        min="1"
        value={formulario.horas}
        onChange={manejarCambio}
        placeholder="Horas"
        required
      />

      <button type="submit" disabled={loading}>
        Anadir curso
      </button>
    </form>
  );
}
```

Explicacion facil:

- El usuario escribe datos.
- `useState` guarda lo que escribe.
- Al enviar el formulario, se llama a `insertarCurso`.
- Supabase guarda el curso en la tabla.

## 11. Crear el listado de cursos

Archivo:

```txt
components/Cursos.jsx
```

Este componente sirve para:

- mostrar cursos;
- editar cursos;
- eliminar cursos.

Codigo:

```jsx
"use client";

import { useEffect } from "react";
import { useCursoStorage } from "@/store/useCursoStorage";

export default function Cursos() {
  const { cursos, error, loading, fetchCursos, eliminarCurso, editarCurso } =
    useCursoStorage();

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const manejarEdicion = async (curso) => {
    const nombre = prompt("Nuevo nombre del curso", curso.nombre);
    if (!nombre) return;

    await editarCurso({
      ...curso,
      nombre: nombre.trim(),
    });
  };

  if (loading && cursos.length === 0) return <p>Cargando cursos...</p>;

  return (
    <section>
      <h2>Listado de cursos</h2>

      {error && <p>{error}</p>}

      {cursos.length > 0 ? (
        cursos.map((curso) => (
          <article key={curso.id}>
            <h3>{curso.nombre}</h3>
            <p>
              {curso.modalidad} - {curso.horas} horas
            </p>

            {curso.updated_at && (
              <p>
                Ultima modificacion:{" "}
                {new Date(curso.updated_at).toLocaleString("es-ES")}
              </p>
            )}

            <button onClick={() => manejarEdicion(curso)}>Editar</button>
            <button onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
          </article>
        ))
      ) : (
        <p>No hay cursos todavia.</p>
      )}
    </section>
  );
}
```

Explicacion facil:

- `useEffect` carga los cursos cuando se abre la pagina.
- `fetchCursos()` pide los cursos a Supabase.
- `.map()` dibuja un bloque por cada curso.
- El boton `Editar` llama a `editarCurso`.
- El boton `Eliminar` llama a `eliminarCurso`.

## 12. Mostrar todo en la pagina principal

Archivo:

```txt
app/page.jsx
```

Codigo:

```jsx
import InputCursos from "@/components/InputCursos";
import Cursos from "@/components/Cursos";

export default function Home() {
  return (
    <main>
      <h1>Gestion de cursos</h1>
      <InputCursos />
      <Cursos />
    </main>
  );
}
```

Explicacion facil:

La pagina principal junta las dos partes:

- formulario para crear cursos;
- listado para ver, editar y eliminar cursos.

## 13. Probar la aplicacion

Primero ejecuta:

```bash
npm run dev
```

Luego abre:

```txt
http://localhost:3000
```

Pruebas que debes hacer:

1. Crear un curso.
2. Ver que aparece en la lista.
3. Editar el curso.
4. Revisar que aparece `updated_at`.
5. Eliminar el curso.

## 14. Demostracion de que funciona

Esta es la parte que el examen pide cuando dice:

```txt
Demuestra que funciona actualizando el nombre de un curso y comprobando que updated_at refleja el momento del cambio.
```

Se hace en Supabase, dentro del SQL Editor.

### Paso 1: Insertar un curso de prueba

Primero mete un curso en la tabla:

```sql
insert into public.cursos (nombre, modalidad, horas)
values ('Curso de prueba', 'online', 20)
returning *;
```

Esto crea un curso nuevo.

Fijate en el `id` que devuelve Supabase. Por ejemplo, puede devolver `id = 1`, `id = 2`, etc.

### Paso 2: Ver el curso antes de modificarlo

Si el curso tiene `id = 1`, ejecuta:

```sql
select id, nombre, modalidad, horas, created_at, updated_at
from public.cursos
where id = 1;
```

Antes de actualizarlo, `updated_at` puede estar vacio porque todavia no se ha modificado.

### Paso 3: Actualizar el curso

Ahora cambia el nombre del curso:

```sql
update public.cursos
set nombre = 'Curso de prueba actualizado'
where id = 1;
```

Cuando haces este `update`, se ejecuta automaticamente el trigger.

### Paso 4: Comprobar que `updated_at` cambio

Ejecuta:

```sql
select id, nombre, updated_at
from public.cursos
where id = 1;
```

Si `updated_at` tiene fecha y hora, significa que el trigger funciona.

### Codigo completo para demostrarlo

Puedes copiar y ejecutar esto completo:

```sql
insert into public.cursos (nombre, modalidad, horas)
values ('Curso de prueba', 'online', 20)
returning *;

select id, nombre, modalidad, horas, created_at, updated_at
from public.cursos
where nombre = 'Curso de prueba';

update public.cursos
set nombre = 'Curso de prueba actualizado'
where nombre = 'Curso de prueba';

select id, nombre, updated_at
from public.cursos
where nombre = 'Curso de prueba actualizado';
```

Resultado esperado:

- Primero ves el curso creado.
- Luego haces un `update`.
- Al final `updated_at` aparece con fecha y hora.
- Eso demuestra que la funcion y el trigger funcionan.

## 15. Comprobar que el proyecto esta bien

Ejecuta:

```bash
npm run lint
npm run build
```

Si no da errores, el proyecto compila correctamente.

## 16. Errores tipicos del examen

### Error 1: No poner `"use client"`

Si un componente usa `useState`, `useEffect`, `onClick` o `onSubmit`, debe empezar con:

```jsx
"use client";
```

### Error 2: Mezclar nombres

Mal:

```jsx
tareas
titulo
descripcion
```

Bien para este examen:

```jsx
cursos
nombre
modalidad
horas
```

### Error 3: Importar archivos que no existen

Si escribes:

```jsx
import Eliminar from "@/components/Eliminar";
```

Debe existir:

```txt
components/Eliminar.jsx
```

Si no existe, la app falla.

### Error 4: No instalar Supabase

Si usas:

```jsx
import { createClient } from "@supabase/supabase-js";
```

Debes instalar:

```bash
npm install @supabase/supabase-js
```

### Error 5: No crear politicas RLS

Si RLS esta activado y no hay policies, Supabase bloquea las consultas.

Por eso hacen falta policies para:

- leer;
- insertar;
- actualizar;
- eliminar.

### Error 6: Hacer la funcion sin `return new`

Mal:

```sql
begin
  new.updated_at = now();
end;
```

Bien:

```sql
begin
  new.updated_at = now();
  return new;
end;
```

## 17. Orden recomendado para hacerlo en examen

1. Crear tabla en Supabase.
2. Crear funcion `set_updated_at`.
3. Crear trigger.
4. Crear policies RLS.
5. Crear `.env.local`.
6. Crear `supabase/client.js`.
7. Crear store.
8. Crear formulario.
9. Crear listado.
10. Mostrar todo en `app/page.jsx`.
11. Probar insertar.
12. Probar listar.
13. Probar editar.
14. Probar eliminar.
15. Probar `updated_at`.
16. Ejecutar `npm run build`.

## 18. Resumen final muy corto

La app funciona asi:

```txt
Formulario -> store -> Supabase -> tabla cursos
```

Y para mostrar datos:

```txt
Tabla cursos -> Supabase -> store -> componente Cursos
```

El trigger funciona asi:

```txt
UPDATE en cursos -> trigger -> funcion set_updated_at -> updated_at = now()
```

Las policies RLS sirven para:

```txt
Permitir que la app pueda hacer SELECT, INSERT, UPDATE y DELETE
```
