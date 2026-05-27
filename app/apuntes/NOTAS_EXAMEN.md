# Notas del examen

## Que pide el ejercicio

### Tarea 1: CRUD con Supabase en Next.js

Hay que crear una aplicacion Next.js que gestione una tabla `cursos` en Supabase.

Campos de la tabla:

- `id`
- `nombre`
- `modalidad`: `presencial` u `online`
- `horas`
- `created_at`

Requisitos:

- Mostrar el listado completo de cursos en un Client Component.
- Usar `useEffect` para cargar los cursos.
- Usar `useState` para el formulario.
- Insertar cursos con `.insert()`.
- Eliminar cursos con `.delete().eq("id", id)`.
- Leer las credenciales de Supabase desde `.env.local`.

### Tarea 2: Funcion y trigger en PostgreSQL

Hay que registrar automaticamente cuando se modifica un curso.

Requisitos:

- Anadir el campo `updated_at` de tipo `timestamptz`.
- Crear una funcion `set_updated_at()` en PL/pgSQL.
- La funcion debe asignar `now()` a `NEW.updated_at`.
- La funcion debe devolver `NEW`.
- Crear un trigger `BEFORE UPDATE` sobre la tabla `cursos`.
- Probarlo haciendo un `UPDATE` y comprobando que `updated_at` cambia.

## Como estaba tu proyecto

Tenias una estructura correcta de proyecto Next.js y ya habias empezado a separar componentes, store y cliente de Supabase. Eso esta bien porque coincide con una forma normal de organizar el ejercicio.

Lo que fallaba era principalmente la coherencia entre nombres:

- En `app/page.jsx` se importaba `Eliminar`, pero ese componente no existe.
- `components/InputCursos.jsx` tenia codigo de pagina, no de formulario.
- `components/Cursos.jsx` importaba `useTareasStorage`, pero el ejercicio es de cursos.
- Habia nombres mal escritos: `fetchCFursos`, `idaCurso`, `editarCurso` frente a `editarCursos`.
- Se usaban variables `tareas`, `titulo` y `descripcion`, pero la tabla pedida usa `cursos`, `nombre`, `modalidad` y `horas`.
- El store no importaba `create` desde Zustand.
- El store importaba Supabase desde una ruta que no existe: `@/app/utils/supabase/client`.
- El SQL del trigger estaba solo planteado, pero no era codigo ejecutable.

## Como te fue

La idea general iba encaminada: sabias que necesitabas componentes, estado, Supabase y una consulta SQL para el trigger. Pero la entrega como estaba no habria funcionado porque la aplicacion no podia compilar y el SQL no se podia ejecutar.

La parte mas floja era la precision tecnica:

- nombres inconsistentes,
- imports incorrectos,
- campos distintos a los del enunciado,
- funcion y trigger sin completar.

Con la correccion, el ejercicio queda mucho mas cerca de una entrega valida.

## Correccion aplicada

Archivos principales:

- `app/page.jsx`: muestra el formulario y el listado.
- `components/InputCursos.jsx`: formulario con `useState` para insertar cursos.
- `components/Cursos.jsx`: listado con `useEffect`, boton de editar y boton de eliminar.
- `store/useCursoStorage.js`: funciones para `select`, `insert`, `delete` y `update`.
- `supabase/client.js`: cliente de Supabase con variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `supabase/snippets/Untitled query 121.sql`: tabla, funcion, trigger y politicas RLS corregidas.

## Notas por componentes

### `app/page.jsx`

Este archivo es la pagina principal de la aplicacion.

Antes tenias importado un componente llamado `Eliminar`, pero ese componente no existia. Eso hacia que la aplicacion fallara al compilar.

La correccion fue dejar esta pagina como contenedor principal:

- Importa `InputCursos`.
- Importa `Cursos`.
- Muestra un titulo.
- Renderiza primero el formulario.
- Renderiza despues el listado.

Idea importante:

```jsx
<InputCursos />
<Cursos />
```

Eso significa:

- `InputCursos` sirve para crear cursos.
- `Cursos` sirve para ver, editar y eliminar cursos.

### `components/InputCursos.jsx`

Este componente es el formulario para insertar cursos.

Tiene que ser Client Component porque usa `useState` y eventos como `onChange` y `onSubmit`.

Por eso empieza con:

```jsx
"use client";
```

Campos del formulario:

- `nombre`
- `modalidad`
- `horas`

Estado inicial:

```jsx
const estadoInicial = {
  nombre: "",
  modalidad: "presencial",
  horas: "",
};
```

La funcion `manejarCambio` actualiza el estado cada vez que escribes en un input.

La funcion `manejarSubmit`:

- evita que la pagina se recargue con `evento.preventDefault()`;
- comprueba que haya nombre y horas;
- llama a `insertarCurso`;
- limpia el formulario.

Parte clave:

```jsx
await insertarCurso({
  nombre: formulario.nombre.trim(),
  modalidad: formulario.modalidad,
  horas: Number(formulario.horas),
});
```

Esto conecta el formulario con Supabase mediante el store.

### `components/Cursos.jsx`

Este componente muestra los cursos guardados en Supabase.

Tambien tiene que ser Client Component porque usa:

- `useEffect`
- botones con `onClick`
- `prompt`

Parte clave:

```jsx
useEffect(() => {
  fetchCursos();
}, [fetchCursos]);
```

Eso significa que cuando el componente se carga, pide los cursos a Supabase.

El componente tambien permite:

- mostrar los cursos con `.map()`;
- editar el nombre de un curso;
- eliminar un curso;
- mostrar `updated_at` si existe.

Para eliminar:

```jsx
onClick={() => eliminarCurso(curso.id)}
```

Para editar:

```jsx
onClick={() => manejarEdicion(curso)}
```

Antes el archivo tenia errores importantes:

- usaba `tareas` en vez de `cursos`;
- usaba `titulo` y `descripcion`, pero el examen pide `nombre`, `modalidad` y `horas`;
- llamaba a funciones con nombres diferentes a los del store;
- tenia variables inexistentes como `idaCurso`.

### `store/useCursoStorage.js`

Este archivo guarda la logica de datos.

Usa Zustand para centralizar las funciones del CRUD:

- `fetchCursos`
- `insertarCurso`
- `eliminarCurso`
- `editarCurso`

Importacion importante:

```jsx
import { create } from "zustand";
import { supabase } from "@/supabase/client";
```

Antes faltaba importar `create`, por eso el store no podia funcionar.

#### `fetchCursos`

Lee los cursos de Supabase:

```jsx
const { data, error } = await supabase
  .from("cursos")
  .select("*")
  .order("id", { ascending: false });
```

Equivale a:

```sql
select * from cursos order by id desc;
```

#### `insertarCurso`

Inserta un nuevo curso:

```jsx
supabase.from("cursos").insert(nuevoCurso)
```

Luego actualiza el estado local para que aparezca en pantalla.

#### `eliminarCurso`

Elimina por `id`:

```jsx
supabase.from("cursos").delete().eq("id", cursoId)
```

Esta parte cumple exactamente lo que pide el examen.

#### `editarCurso`

Actualiza un curso:

```jsx
supabase
  .from("cursos")
  .update({
    nombre: cursoEditado.nombre,
    modalidad: cursoEditado.modalidad,
    horas: cursoEditado.horas,
  })
  .eq("id", cursoEditado.id)
```

Cuando se ejecuta este `update`, el trigger de PostgreSQL debe actualizar `updated_at`.

### `supabase/client.js`

Este archivo crea la conexion con Supabase.

Codigo importante:

```jsx
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
```

Como el cliente se usa en componentes del navegador, las variables deben empezar por `NEXT_PUBLIC_`.

En `.env.local` debes tener algo parecido a:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

No debes subir `.env.local` a GitHub.

### `supabase/snippets/Untitled query 121.sql`

Este archivo contiene la parte de PostgreSQL.

El examen pide una funcion y un trigger para actualizar automaticamente `updated_at`. Ademas, en Supabase normalmente hay que tener en cuenta las politicas RLS si la app usa la clave anonima desde el navegador.

La tabla corregida usa:

- `id`
- `nombre`
- `modalidad`
- `horas`
- `created_at`
- `updated_at`

La funcion:

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

Explicacion:

- `returns trigger`: indica que la funcion se usa con un trigger.
- `new.updated_at = now();`: guarda la fecha actual.
- `return new;`: devuelve la fila modificada.

El trigger:

```sql
create trigger trg_set_updated_at
before update on public.cursos
for each row
execute function public.set_updated_at();
```

Explicacion:

- `before update`: se ejecuta antes de modificar una fila.
- `on public.cursos`: se aplica a la tabla `cursos`.
- `for each row`: se ejecuta por cada fila modificada.
- `execute function`: llama a la funcion.

### Politicas RLS en Supabase

RLS significa Row Level Security.

Si RLS esta activado en Supabase y no existen politicas, la app puede conectarse, pero no podra leer, insertar, actualizar ni eliminar filas.

Para una practica sin login, se pueden crear politicas abiertas para el rol `anon`.

Codigo:

```sql
alter table public.cursos enable row level security;

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

Explicacion:

- `select`: permite listar cursos.
- `insert`: permite crear cursos.
- `update`: permite editar cursos.
- `delete`: permite eliminar cursos.
- `to anon`: permite que funcione con la clave anonima de Supabase.
- `using (true)`: permite acceder a las filas existentes.
- `with check (true)`: permite guardar los datos nuevos o modificados.

Importante:

Estas politicas son utiles para examen o pruebas, pero son demasiado abiertas para una aplicacion real con usuarios.

### `package.json`

Este archivo contiene scripts y dependencias.

Scripts importantes:

```json
"dev": "next dev",
"build": "next build",
"lint": "eslint"
```

Comandos utiles:

```bash
npm run dev
npm run lint
npm run build
```

Dependencias necesarias para este examen:

- `next`
- `react`
- `react-dom`
- `@supabase/supabase-js`
- `zustand`

`@supabase/supabase-js` permite conectar con Supabase.

`zustand` permite crear un store para compartir estado y funciones entre componentes.

### `app/layout.jsx`

Este archivo envuelve toda la aplicacion.

Define:

- idioma de la pagina;
- fuentes;
- metadatos;
- estructura HTML base.

No era el centro del examen, pero estaba correcto para una aplicacion Next.js.

### `app/globals.css`

Este archivo contiene estilos globales.

Tiene:

```css
@import "tailwindcss";
```

Eso permite usar clases de Tailwind directamente en los componentes, por ejemplo:

```jsx
className="rounded-md bg-slate-900 px-4 py-2 text-white"
```

Tailwind no es obligatorio para el CRUD, pero ayuda a que la interfaz se vea mejor.

## Resumen de errores que debes recordar

- Si usas `useState`, `useEffect` o `onClick`, el componente necesita `"use client"`.
- Los nombres deben coincidir en todos los archivos.
- Si la tabla se llama `cursos`, evita dejar variables como `tareas`.
- Si el campo se llama `nombre`, no uses `titulo`.
- Si importas un componente, el archivo debe existir.
- Si usas Supabase en navegador, las variables deben empezar por `NEXT_PUBLIC_`.
- El trigger de PostgreSQL necesita funcion completa, `return new` y `before update`.

## SQL corregido

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at on public.cursos;

create trigger trg_set_updated_at
before update on public.cursos
for each row
execute function public.set_updated_at();

alter table public.cursos enable row level security;

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

## Demostracion de que funciona

Esta es la parte que pide el examen:

```txt
Demuestra que funciona actualizando el nombre de un curso y comprobando que updated_at refleja el momento del cambio.
```

Se demuestra asi:

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

Si despues del `update` el campo `updated_at` tiene fecha y hora, el trigger funciona.

## Prueba corta del trigger

```sql
update public.cursos
set nombre = nombre || ' actualizado'
where id = 1;

select id, nombre, updated_at
from public.cursos
where id = 1;
```

Si `updated_at` aparece con fecha y hora despues del `UPDATE`, el trigger funciona.
