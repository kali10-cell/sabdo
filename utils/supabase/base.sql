// -- -- create table objetos (
// -- --   id serial primary key,
// -- --   objeto text,
// -- --   rareza text,
// -- --   cantidad integer,
// -- --   created_at timestamp default now()
// -- -- );

// -- select * from objetos;



// ---POLITICAS DE RLS

// alter table public.objetos enable row level security;

// create policy "permitir leer objetos"
// on public.objetos
// for select
// using (true);

// create policy "permitir insertar objetos"
// on public.objetos
// for insert
// with check (true);

// create policy "permitir eliminar objetos"
// on public.objetos
// for delete
// using (true);

// create policy "permitir actualizar objetos"
// on public.objetos
// for update
// using (true)
// with check (true);



// --- funcion para actualizar la fecha de modificacion
// alter table objetos
// add column updated_at timestamp default now();


// create or replace function actualizar_fecha()
// returns trigger
// language plpgsql
// as $$
// begin

//   new.updated_at = now();

//   return new;

// end;
// $$;

// create trigger trigger_actualizar_fecha

// before update
// on objetos

// for each row

// execute function actualizar_fecha();

// ==============================
// Si tu profe exige nombres en espanol (para created/updated)
// ==============================
//
// Opcion A (crear columnas nuevas en espanol):
//
// alter table public.objetos
// add column if not exists creado_en timestamptz not null default now(),
// add column if not exists actualizado_en timestamptz;
//
// create or replace function public.set_actualizado_en()
// returns trigger language plpgsql as $$
// begin
//   new.actualizado_en = now();
//   return new;
// end;
// $$;
//
// drop trigger if exists trg_set_actualizado_en on public.objetos;
// create trigger trg_set_actualizado_en
// before update on public.objetos
// for each row execute function public.set_actualizado_en();
//
// Opcion B (renombrar las columnas ingles -> espanol):
// alter table public.objetos rename column created_at to creado_en;
// alter table public.objetos rename column updated_at to actualizado_en;



-- ==============================
-- INVENTARIO (objetos) - EXTRA
-- Ejecuta esto en Supabase SQL Editor
-- ==============================

-- Añadir modalidad de compra (online/presencial)
-- Si ya existe, no pasa nada (usa IF NOT EXISTS)
alter table public.objetos
add column if not exists modalidad text default 'online';

-- (Opcional) forzar valores válidos
-- alter table public.objetos
-- add constraint objetos_modalidad_check
-- check (modalidad in ('online', 'presencial'));

-- Recargar schema cache de PostgREST
notify pgrst, 'reload schema';
