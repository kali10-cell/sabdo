# 02 — Teoría previa: Seguridad en bases de datos desde cero

> Objetivo: entender los conceptos que aparecen en las políticas de Flex antes de leer el código

---

## Antes de empezar: ¿por qué no basta con validar en el frontend?

Cuando construyes una app web, la lógica que ves en el navegador (React, JavaScript) es **código público**. Cualquier persona puede abrir las herramientas de desarrollador de su navegador, ver tus peticiones a la API, copiar las claves que usas y lanzar peticiones directas a tu base de datos, saltándose por completo tu aplicación.

```
Sin protección en la base de datos:

Usuario malicioso → abre DevTools → copia la API key → lanza petición directa → obtiene TODOS los datos
                                                                                ↑
                                                    tu validación de frontend no interviene aquí
```

La solución es mover la seguridad a un sitio donde el usuario no pueda llegar: **dentro del motor de la base de datos**. Eso es exactamente lo que hace PostgreSQL con Row Level Security.

---

## 1. Roles y autenticación en Supabase

### ¿Qué es un rol en PostgreSQL?

En PostgreSQL, un **rol** es una identidad con permisos específicos. Es como un tipo de usuario, pero más genérico: puede ser una persona, un servicio, o un proceso automatizado.

Cuando alguien hace una petición a Supabase, llega con uno de estos tres roles predefinidos:

| Rol | Quién lo usa | Para qué |
|-----|-------------|----------|
| `anon` | Usuarios no autenticados | Ver contenido público |
| `authenticated` | Usuarios que han hecho login | Acceder a sus propios datos |
| `service_role` | Servidores y Edge Functions | Operaciones del sistema (ignora RLS) |

```
Petición sin login → Supabase la marca como rol 'anon'
Petición con token → Supabase la marca como rol 'authenticated'
Petición con service_role key → Supabase la marca como rol 'service_role'
```

### Las funciones `auth.uid()` y `auth.role()`

Supabase expone dos funciones de ayuda que puedes usar directamente en SQL:

```sql
-- Devuelve el UUID del usuario autenticado actualmente
-- Si no hay usuario, devuelve null
SELECT auth.uid();

-- Devuelve el rol actual de la petición: 'anon', 'authenticated', 'service_role'
SELECT auth.role();
```

Estas funciones leen el **token JWT** que acompaña a la petición HTTP. El JWT es un pequeño fichero cifrado que Supabase Auth genera al hacer login y que el navegador adjunta a todas las peticiones posteriores.

```
Usuario hace login
       ↓
Supabase devuelve un JWT con: { sub: "UUID-del-usuario", role: "authenticated", ... }
       ↓
El navegador guarda el JWT y lo manda en cada petición
       ↓
PostgreSQL lo lee con auth.uid() y auth.role()
```

### Ejercicio 1

Razona sin ejecutar código: un usuario no autenticado hace una petición a Supabase. ¿Qué devuelven `auth.uid()` y `auth.role()` en ese caso?

<details>
<summary>Respuesta</summary>

- `auth.uid()` devuelve `null` porque no hay ningún usuario identificado.
- `auth.role()` devuelve `'anon'` porque Supabase asigna ese rol por defecto a las peticiones sin token de autenticación.

Esto tiene consecuencias importantes: si escribes una política que comprueba `auth.uid() = cliente_id`, un usuario no autenticado nunca podrá pasar esa comprobación (porque `null = cliente_id` es `null`, que se evalúa como falso).

</details>

---

## 2. Row Level Security (RLS)

### ¿Qué es RLS?

**Row Level Security** (seguridad a nivel de fila) es una característica de PostgreSQL que te permite definir reglas que determinan qué filas puede ver o modificar cada usuario.

La clave está en "a nivel de fila": no es "este usuario puede acceder a la tabla `pedidos`" sino "este usuario puede ver **las filas de** `pedidos` **donde** `cliente_id = su UUID`".

```
Sin RLS:
SELECT * FROM pedidos → devuelve los 500 pedidos de todos los clientes

Con RLS (política activa):
SELECT * FROM pedidos → devuelve solo los 3 pedidos de ESE cliente
                        (PostgreSQL filtra automáticamente antes de responder)
```

### Activar RLS en una tabla

RLS está **desactivado por defecto**. Hay que activarlo tabla a tabla con:

```sql
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
```

**Comportamiento importante:** una tabla con RLS activado pero sin ninguna política definida **deniega todo acceso**. Es un estado seguro por defecto: "si no hay regla que lo permita, está prohibido".

```sql
-- Activar RLS en varias tablas de golpe:
ALTER TABLE public.perfiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos    ENABLE ROW LEVEL SECURITY;

-- Con RLS activado y sin políticas:
SELECT * FROM public.pedidos;
-- Devuelve 0 filas (aunque haya datos). No es un error, simplemente no pasa la política.
```

### Ejercicio 2

Tienes una tabla `facturas` con RLS activado y ninguna política definida. Un administrador conectado como `service_role` intenta hacer `SELECT * FROM facturas`. ¿Cuántas filas obtiene? ¿Y un usuario autenticado normal?

<details>
<summary>Respuesta</summary>

- **`service_role`**: obtiene **todas las filas**. El rol `service_role` bypasea RLS completamente; las políticas no se evalúan para él.
- **Usuario autenticado**: obtiene **0 filas**. Con RLS activo y sin políticas, ningún usuario normal puede leer nada. Que el usuario esté autenticado no es suficiente: necesita una política que lo permita explícitamente.

</details>

---

## 3. Políticas (`CREATE POLICY`)

### ¿Qué es una política?

Una **política** es una regla que le dice a PostgreSQL: "permite esta operación si se cumple esta condición". Se define por tabla y por tipo de operación.

```sql
CREATE POLICY "nombre descriptivo"
  ON nombre_tabla
  FOR SELECT          -- qué operación: SELECT, INSERT, UPDATE, DELETE o ALL
  USING ( condicion );  -- condición que debe cumplirse
```

El nombre entre comillas es solo descriptivo, pero es importante escribirlo bien porque aparecerá en los logs de error y en el panel de Supabase.

### `USING` vs `WITH CHECK`

Hay dos tipos de condición en una política:

| Cláusula | Se evalúa en | Para qué sirve |
|----------|-------------|----------------|
| `USING` | SELECT, UPDATE, DELETE | Filtra qué filas **existentes** puede ver o tocar el usuario |
| `WITH CHECK` | INSERT, UPDATE | Valida los **nuevos datos** que el usuario quiere escribir |

```sql
-- USING: "qué filas puede leer"
-- Solo permite leer las filas donde el cliente_id coincide con el usuario actual
CREATE POLICY "cliente: ver sus pedidos"
  ON public.pedidos FOR SELECT
  USING ( cliente_id = auth.uid() );

-- WITH CHECK: "qué datos puede escribir"
-- Solo permite insertar filas donde el cliente_id sea el propio usuario
CREATE POLICY "cliente: crear pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK ( cliente_id = auth.uid() );
```

Para `UPDATE`, normalmente se usan **ambas**:
- `USING`: qué filas puede actualizar (las que puede "ver")
- `WITH CHECK`: cómo puede quedar la fila después de la actualización

```sql
-- Un cliente puede cancelar su reserva, pero solo si está en estado 'pendiente'
-- y solo puede ponerla como 'cancelada' (no como 'pagada')
CREATE POLICY "cliente: cancelar reserva pendiente"
  ON public.reservas FOR UPDATE
  USING (
    cliente_id = auth.uid()
    AND estado = 'pendiente'      -- solo puede tocar reservas pendientes
  )
  WITH CHECK (
    cliente_id = auth.uid()
    AND estado = 'cancelada'      -- solo puede dejarlas como canceladas
  );
```

### Ejercicio: USING vs WITH CHECK

Un banco quiere que los clientes puedan ver sus propias cuentas pero no puedan aumentar su propio saldo directamente. Escribe la política de UPDATE para la tabla `cuentas(id, usuario_id, saldo)`.

<details>
<summary>Respuesta</summary>

```sql
-- El usuario puede actualizar su cuenta, pero el saldo en el resultado
-- no puede ser mayor que el saldo actual (no puede "inventarse" dinero)
CREATE POLICY "cliente: actualizar su cuenta"
  ON public.cuentas FOR UPDATE
  USING ( usuario_id = auth.uid() )
  WITH CHECK (
    usuario_id = auth.uid()
    AND saldo <= (SELECT saldo FROM public.cuentas WHERE id = cuentas.id)
  );
```

`USING` limita a qué filas puede acceder (solo las suyas). `WITH CHECK` valida que el resultado no sea fraudulento (el saldo no puede crecer). Un sistema real usaría transacciones y funciones para esto, pero la idea de separar "qué puedes tocar" de "cómo puede quedar" es exactamente el rol de `USING` vs `WITH CHECK`.

</details>