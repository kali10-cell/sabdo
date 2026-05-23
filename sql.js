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