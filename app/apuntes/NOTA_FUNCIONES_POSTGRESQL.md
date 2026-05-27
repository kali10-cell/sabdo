# Nota aparte: funciones y triggers en PostgreSQL

Esta nota es solo para entender la parte de funciones del examen.

## 1. Que es una funcion en PostgreSQL

Una funcion es un bloque de codigo que PostgreSQL puede ejecutar.

Sirve para automatizar una accion.

Ejemplo sencillo:

```sql
create or replace function saludar()
returns text
language plpgsql
as $$
begin
  return 'Hola';
end;
$$;
```

Explicacion:

- `create or replace function`: crea la funcion o la reemplaza si ya existe.
- `saludar()`: nombre de la funcion.
- `returns text`: la funcion devuelve texto.
- `language plpgsql`: usa el lenguaje PL/pgSQL.
- `begin ... end`: dentro va el codigo.
- `return`: devuelve un resultado.

## 2. Que es PL/pgSQL

PL/pgSQL es el lenguaje que usa PostgreSQL para escribir funciones con logica.

Permite usar:

- variables;
- condiciones;
- funciones;
- triggers;
- `NEW`;
- `OLD`;
- `RETURN`.

## 3. Que es un trigger

Un trigger es algo que se ejecuta automaticamente cuando pasa algo en una tabla.

Puede ejecutarse cuando haces:

- `INSERT`
- `UPDATE`
- `DELETE`

Ejemplo:

```sql
create trigger nombre_del_trigger
before update on public.cursos
for each row
execute function public.set_updated_at();
```

Explicacion:

- `create trigger`: crea el trigger.
- `before update`: se ejecuta antes de actualizar.
- `on public.cursos`: funciona en la tabla `cursos`.
- `for each row`: se ejecuta por cada fila.
- `execute function`: llama a una funcion.

## 4. Diferencia entre funcion normal y funcion trigger

Una funcion normal devuelve datos normales, por ejemplo texto o numero.

Ejemplo:

```sql
returns text
```

Una funcion para trigger debe devolver:

```sql
returns trigger
```

Porque no se llama manualmente, la llama el trigger.

## 5. Que es `NEW`

`NEW` representa la fila nueva.

Se usa en:

- `INSERT`
- `UPDATE`

Ejemplo:

```sql
new.updated_at = now();
```

Eso significa:

```txt
A la fila nueva o modificada, ponle la fecha actual en updated_at.
```

En tu examen se usa `NEW` porque quieres modificar la fila antes de guardarla.

## 6. Que es `OLD`

`OLD` representa la fila vieja.

Se usa normalmente en:

- `UPDATE`
- `DELETE`

Ejemplo:

```sql
old.nombre
```

Eso significa:

```txt
El nombre que tenia la fila antes del cambio.
```

Ejemplo de uso:

```sql
insert into auditoria (texto)
values ('Antes se llamaba: ' || old.nombre);
```

En tu examen no hace falta `OLD`, porque solo necesitas guardar la fecha nueva en `updated_at`.

## 7. Diferencia entre `BEFORE` y `AFTER`

### `BEFORE`

Se ejecuta antes de guardar el cambio.

Sirve para modificar la fila antes de que se guarde.

Ejemplo:

```sql
before update
```

En tu examen se usa `BEFORE UPDATE` porque quieres hacer esto:

```sql
new.updated_at = now();
```

Es decir, modificar el dato antes de guardarlo.

### `AFTER`

Se ejecuta despues de guardar el cambio.

Sirve para registrar cosas en otra tabla, hacer auditorias o guardar logs.

Ejemplo:

```sql
after delete
```

Un `AFTER` no es lo ideal para cambiar `NEW.updated_at`, porque la fila ya se guardo.

## 8. Por que en el examen es `BEFORE UPDATE`

El examen pide:

```txt
Cuando se modifique un curso, updated_at debe reflejar el momento del cambio.
```

Entonces necesitas:

```sql
before update
```

Porque antes de guardar el cambio, PostgreSQL pone:

```sql
new.updated_at = now();
```

Luego guarda la fila ya corregida.

## 9. Funcion del examen

Esta es la funcion correcta:

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

Explicacion linea por linea:

```sql
create or replace function public.set_updated_at()
```

Crea una funcion llamada `set_updated_at`.

```sql
returns trigger
```

Indica que la funcion sera usada por un trigger.

```sql
language plpgsql
```

Indica que se escribe en PL/pgSQL.

```sql
as $$
```

Empieza el cuerpo de la funcion.

```sql
begin
```

Empieza el bloque de instrucciones.

```sql
new.updated_at = now();
```

Pone la fecha actual en el campo `updated_at` de la fila nueva.

```sql
return new;
```

Devuelve la fila modificada para que PostgreSQL la guarde.

```sql
end;
$$;
```

Termina la funcion.

## 10. Trigger del examen

Este es el trigger correcto:

```sql
create trigger trg_set_updated_at
before update on public.cursos
for each row
execute function public.set_updated_at();
```

Explicacion linea por linea:

```sql
create trigger trg_set_updated_at
```

Crea un trigger llamado `trg_set_updated_at`.

```sql
before update on public.cursos
```

Se ejecuta antes de actualizar una fila de la tabla `cursos`.

```sql
for each row
```

Se ejecuta por cada fila modificada.

```sql
execute function public.set_updated_at();
```

Ejecuta la funcion `set_updated_at`.

## 11. Demostracion del examen

Para demostrar que funciona:

```sql
insert into public.cursos (nombre, modalidad, horas)
values ('Curso de prueba', 'online', 20)
returning *;
```

Luego miras el curso:

```sql
select id, nombre, created_at, updated_at
from public.cursos
where nombre = 'Curso de prueba';
```

Despues lo actualizas:

```sql
update public.cursos
set nombre = 'Curso de prueba actualizado'
where nombre = 'Curso de prueba';
```

Y compruebas:

```sql
select id, nombre, updated_at
from public.cursos
where nombre = 'Curso de prueba actualizado';
```

Si `updated_at` tiene fecha y hora, funciona.

## 12. Errores comunes

### Error: olvidar `return new`

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

### Error: usar `AFTER UPDATE` para cambiar `NEW`

Mal para este caso:

```sql
after update
```

Bien:

```sql
before update
```

### Error: escribir mal `timestamptz`

Mal:

```sql
timestampz
```

Bien:

```sql
timestamptz
```

### Error: no poner `for each row`

El trigger necesita:

```sql
for each row
```

Porque quieres que funcione para cada curso actualizado.

## 13. Resumen muy corto

Funcion:

```txt
Define que hacer.
```

Trigger:

```txt
Decide cuando hacerlo.
```

`NEW`:

```txt
Fila nueva o modificada.
```

`OLD`:

```txt
Fila anterior.
```

`BEFORE UPDATE`:

```txt
Antes de guardar el cambio.
```

`RETURN NEW`:

```txt
Devuelve la fila modificada para que PostgreSQL la guarde.
```
