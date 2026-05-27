-- Plantilla generica (en espanol) para examenes CRUD con:
-- - tabla + created/updated en espanol
-- - funcion + trigger para actualizar "actualizado_en"
-- - RLS + policies abiertas para anon (solo para examen/sin login)
--
-- Cambia el nombre de la tabla y las columnas de "TU_ENTIDAD" segun el enunciado.

create table if not exists public.TU_ENTIDAD (
  id bigint generated always as identity primary key,
  nombre text not null,
  tipo text,
  cantidad integer not null check (cantidad >= 0),
  modalidad text not null default 'online'
    check (modalidad in ('online', 'presencial')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz
);

create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists trg_set_actualizado_en on public.TU_ENTIDAD;

create trigger trg_set_actualizado_en
before update on public.TU_ENTIDAD
for each row
execute function public.set_actualizado_en();

alter table public.TU_ENTIDAD enable row level security;

drop policy if exists "permitir leer" on public.TU_ENTIDAD;
drop policy if exists "permitir insertar" on public.TU_ENTIDAD;
drop policy if exists "permitir actualizar" on public.TU_ENTIDAD;
drop policy if exists "permitir eliminar" on public.TU_ENTIDAD;

create policy "permitir leer"
on public.TU_ENTIDAD
for select
to anon
using (true);

create policy "permitir insertar"
on public.TU_ENTIDAD
for insert
to anon
with check (true);

create policy "permitir actualizar"
on public.TU_ENTIDAD
for update
to anon
using (true)
with check (true);

create policy "permitir eliminar"
on public.TU_ENTIDAD
for delete
to anon
using (true);

