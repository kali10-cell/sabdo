# Apuntes de los manuales de Next.js

Estos apuntes resumen los 4 manuales que tambien pueden entrar en examen.

La idea general es entender Next.js desde lo basico:

- componentes;
- props;
- estado;
- efectos;
- rutas;
- layouts;
- imagenes;
- server/client components;
- variables de entorno;
- rutas dinamicas;
- server actions;
- Zustand.

## Manual 1: JSX, componentes, props, state y useEffect

### 1. Crear un proyecto Next.js

Comando:

```bash
npx create-next-app@latest nombre-del-proyecto
```

Despues entras en la carpeta:

```bash
cd nombre-del-proyecto
```

Y arrancas el servidor:

```bash
npm run dev
```

Normalmente se abre en:

```txt
http://localhost:3000
```

### 2. Que es JSX

JSX parece HTML, pero esta dentro de JavaScript.

Ejemplo:

```jsx
export default function Page() {
  const nombre = "Susana";

  return <h1>Hola {nombre}</h1>;
}
```

La parte importante es esta:

```jsx
{nombre}
```

Las llaves `{}` sirven para meter JavaScript dentro del HTML.

### 3. Que es un componente

Un componente es una pieza reutilizable de la interfaz.

Ejemplo:

```jsx
export default function Estacion({ nombre, operario }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>Operario: {operario}</p>
    </div>
  );
}
```

Un componente:

- es una funcion;
- empieza con mayuscula;
- devuelve JSX;
- se puede importar en otras paginas.

### 4. Que son las props

Las props son datos que un componente recibe desde fuera.

Ejemplo:

```jsx
<Estacion nombre="Montaje" operario="Ana" />
```

El componente recibe:

```jsx
function Estacion({ nombre, operario }) {
```

Explicacion facil:

```txt
Props = informacion que el padre le pasa al hijo.
```

### 5. Que es useState

`useState` sirve para guardar datos que pueden cambiar en pantalla.

Ejemplo:

```jsx
"use client";

import { useState } from "react";

export default function Contador() {
  const [piezas, setPiezas] = useState(0);

  return (
    <button onClick={() => setPiezas(piezas + 1)}>
      Piezas: {piezas}
    </button>
  );
}
```

Explicacion:

- `piezas`: valor actual.
- `setPiezas`: funcion para cambiar el valor.
- `useState(0)`: empieza en 0.

Importante:

Si usas `useState`, el archivo debe empezar con:

```jsx
"use client";
```

### 6. Que es useEffect

`useEffect` sirve para ejecutar codigo cuando el componente se carga o cuando cambia algo.

Ejemplo:

```jsx
"use client";

import { useEffect, useState } from "react";

export default function Clima() {
  const [temperatura, setTemperatura] = useState("Cargando...");

  useEffect(() => {
    setTemperatura("22 grados");
  }, []);

  return <p>Temperatura: {temperatura}</p>;
}
```

Explicacion:

- `useEffect` se ejecuta despues de pintar el componente.
- `[]` significa que se ejecuta solo una vez.
- Se usa mucho para llamar APIs desde el cliente.

### 7. Cuando usar useEffect

Usalo cuando:

- necesitas datos del navegador;
- necesitas llamar a una API desde cliente;
- necesitas actualizar algo al cargar;
- necesitas escuchar cambios.

No lo uses para todo. En Next.js moderno muchas cargas de datos se hacen mejor en Server Components.

### 8. Lo que podria caer del Manual 1

Te pueden pedir:

- crear un componente;
- pasar props;
- usar `useState`;
- hacer un boton que cambie un contador;
- usar `useEffect`;
- explicar por que hace falta `"use client"`;
- montar una pagina con varios componentes.

## Manual 2: Layout, routing, Link e imagenes

### 1. Routing en Next.js

En Next.js, las rutas se crean con carpetas dentro de `app`.

Ejemplo:

```txt
app/page.jsx
app/produccion/page.jsx
app/logistica/page.jsx
```

Eso crea estas rutas:

```txt
/
/produccion
/logistica
```

Explicacion facil:

```txt
Carpeta dentro de app = ruta nueva.
page.jsx = pagina que se muestra en esa ruta.
```

### 2. Que es un layout

Un layout es una estructura comun para varias paginas.

Ejemplo:

```jsx
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <nav>
          <Link href="/">Inicio</Link>
          <Link href="/produccion">Produccion</Link>
          <Link href="/logistica">Logistica</Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
```

La clave es:

```jsx
{children}
```

`children` representa la pagina actual.

Si estas en `/produccion`, dentro de `children` aparece `app/produccion/page.jsx`.

### 3. Que es Link

`Link` sirve para navegar entre paginas sin recargar toda la web.

Ejemplo:

```jsx
import Link from "next/link";

<Link href="/produccion">Ir a produccion</Link>
```

No es lo mismo que:

```html
<a href="/produccion">
```

En Next.js es mejor usar `Link`.

### 4. Metadata

En `app/layout.jsx` puedes poner:

```jsx
export const metadata = {
  title: "Mi aplicacion",
  description: "Panel de gestion",
};
```

Esto cambia:

- titulo de la pestana;
- descripcion de la pagina;
- datos SEO basicos.

### 5. Imagenes con next/image

En Next.js no se recomienda usar directamente:

```html
<img>
```

Se usa:

```jsx
import Image from "next/image";
```

Ejemplo con imagen local:

```jsx
import Image from "next/image";
import foto from "@/public/foto.png";

export default function Page() {
  return <Image src={foto} alt="Descripcion de la imagen" />;
}
```

Ventajas de `Image`:

- optimiza peso;
- mejora carga;
- evita saltos visuales;
- puede usar lazy loading;
- puede convertir formatos.

### 6. Imagen externa

Si la imagen viene de internet, hay que permitir el dominio en `next.config.mjs`.

Ejemplo:

```js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

Despues puedes usar:

```jsx
<Image
  src="https://images.unsplash.com/foto.jpg"
  alt="Imagen externa"
  width={800}
  height={400}
/>
```

### 7. Imagen con fill

`fill` sirve cuando quieres que la imagen llene un contenedor.

Ejemplo:

```jsx
<div className="relative h-64 w-full">
  <Image
    src={url}
    alt="Planta industrial"
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>
```

Importante:

- El contenedor padre debe tener `relative`.
- El contenedor debe tener altura.
- Usa `object-cover` para que no se deforme.

### 8. Lo que podria caer del Manual 2

Te pueden pedir:

- crear varias rutas;
- crear un layout comun;
- hacer un menu con `Link`;
- explicar `children`;
- poner metadata;
- usar `next/image`;
- configurar una imagen externa en `next.config.mjs`;
- usar `fill`, `sizes` y `object-cover`.

## Manual 3: Server Components, Client Components, rutas dinamicas y Server Actions

### 1. Server Components

En Next.js App Router, los componentes son Server Components por defecto.

Eso significa:

```txt
Si no pones "use client", el componente se ejecuta en el servidor.
```

Sirven para:

- leer datos;
- llamar APIs secretas;
- usar variables privadas;
- renderizar HTML mas rapido;
- no mandar tanto JavaScript al navegador.

Ejemplo:

```jsx
export default async function Page() {
  const datos = await fetch("https://api.example.com/datos");
  const json = await datos.json();

  return <pre>{JSON.stringify(json, null, 2)}</pre>;
}
```

### 2. Client Components

Un Client Component necesita:

```jsx
"use client";
```

Se usa cuando hay:

- `useState`;
- `useEffect`;
- `onClick`;
- `onChange`;
- formularios interactivos;
- botones;
- acceso a `window`;
- acceso a `localStorage`.

Ejemplo:

```jsx
"use client";

import { useState } from "react";

export default function Boton() {
  const [contador, setContador] = useState(0);

  return <button onClick={() => setContador(contador + 1)}>{contador}</button>;
}
```

### 3. Regla facil para examen

Si el componente solo muestra datos:

```txt
Server Component
```

Si el componente tiene botones o estado:

```txt
Client Component
```

### 4. Variables de entorno

Archivo:

```txt
.env.local
```

Variable privada:

```env
WEATHER_API_KEY=clave_privada
```

Variable publica:

```env
NEXT_PUBLIC_EMPRESA="SolVitoria S.L."
```

Regla:

- Sin `NEXT_PUBLIC_`: solo servidor.
- Con `NEXT_PUBLIC_`: visible en navegador.

No pongas claves secretas con `NEXT_PUBLIC_`.

### 5. Fetch en servidor vs fetch en cliente

Fetch en servidor:

- mejor para SEO;
- mas seguro;
- permite usar claves privadas;
- se ejecuta antes de enviar la pagina.

Fetch en cliente con `useEffect`:

- sirve para datos del navegador;
- datos en tiempo real;
- dashboards privados;
- datos que dependen de `localStorage` o GPS.

### 6. Rutas dinamicas

Una ruta dinamica usa corchetes.

Ejemplo:

```txt
app/vehiculos/[vin]/page.jsx
```

Esto permite rutas como:

```txt
/vehiculos/VTO-001
/vehiculos/VTO-002
```

Dentro de la pagina puedes leer el parametro:

```jsx
export default async function FichaVehiculo({ params }) {
  const { vin } = await params;

  return <h1>Vehiculo {vin}</h1>;
}
```

### 7. Links dinamicos

Si tienes una lista:

```jsx
import Link from "next/link";

{vehiculos.map((vehiculo) => (
  <Link key={vehiculo.vin} href={`/vehiculos/${vehiculo.vin}`}>
    {vehiculo.modelo}
  </Link>
))}
```

Cada elemento lleva a su ficha.

### 8. Server Actions

Una Server Action es una funcion que se ejecuta en el servidor.

Sirve para modificar datos sin crear una API manual.

Ejemplo:

```jsx
"use server";

export async function registrarIncidencia(formData) {
  const texto = formData.get("texto");
  console.log(texto);
}
```

Uso en un formulario:

```jsx
import { registrarIncidencia } from "./actions";

export default function Page() {
  return (
    <form action={registrarIncidencia}>
      <input name="texto" />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

Regla:

```txt
Server Action = funcion async que corre en servidor.
```

### 9. Lo que podria caer del Manual 3

Te pueden pedir:

- explicar Server Component vs Client Component;
- saber cuando poner `"use client"`;
- usar `.env.local`;
- diferenciar variable privada y publica;
- crear ruta dinamica con `[id]`;
- leer `params`;
- crear links dinamicos;
- hacer un Server Action con un formulario.

## Manual 4: Zustand

### 1. Que es Zustand

Zustand es una libreria para manejar estado global.

Estado global significa:

```txt
Datos que pueden usar varios componentes a la vez.
```

Ejemplo:

- lista de cursos;
- usuario conectado;
- carrito de compra;
- coches fabricados;
- stock.

### 2. Diferencia entre useState y Zustand

`useState`:

- sirve para un componente;
- perfecto para formularios pequenos;
- el estado vive dentro del componente.

Zustand:

- sirve para varios componentes;
- evita pasar props por todos lados;
- centraliza datos y funciones.

### 3. Instalar Zustand

Comando:

```bash
npm install zustand
```

### 4. Crear un store

Archivo:

```txt
store/useFactoryStore.js
```

Ejemplo:

```jsx
import { create } from "zustand";

export const useFactoryStore = create((set) => ({
  cars: [],
  enginesInStock: 50,

  useEngine: () =>
    set((state) => ({
      enginesInStock: state.enginesInStock - 1,
    })),

  addCar: (modelName) =>
    set((state) => ({
      cars: [...state.cars, { id: Date.now(), model: modelName }],
    })),
}));
```

### 5. Partes de un store

Estado:

```jsx
cars: [],
enginesInStock: 50,
```

Acciones:

```jsx
useEngine: () => set(...)
addCar: (modelName) => set(...)
```

`set` sirve para cambiar el estado.

No se debe hacer:

```jsx
state.enginesInStock = 49;
```

Se debe hacer:

```jsx
set((state) => ({
  enginesInStock: state.enginesInStock - 1,
}));
```

### 6. Usar el store en un componente

Si usas Zustand dentro de un componente, normalmente necesitas:

```jsx
"use client";
```

Ejemplo:

```jsx
"use client";

import { useFactoryStore } from "@/store/useFactoryStore";

export default function EngineMonitor() {
  const engines = useFactoryStore((state) => state.enginesInStock);

  return <p>Motores: {engines}</p>;
}
```

### 7. Usar una accion del store

```jsx
"use client";

import { useFactoryStore } from "@/store/useFactoryStore";

export default function FactoryControls() {
  const addCar = useFactoryStore((state) => state.addCar);
  const useEngine = useFactoryStore((state) => state.useEngine);

  const fabricar = () => {
    addCar("Tesla Model S");
    useEngine();
  };

  return <button onClick={fabricar}>Fabricar coche</button>;
}
```

### 8. Persistencia con localStorage

Zustand puede guardar datos en `localStorage` usando `persist`.

Ejemplo:

```jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFactoryStore = create(
  persist(
    (set) => ({
      cars: [],
      addCar: (modelName) =>
        set((state) => ({
          cars: [...state.cars, { id: Date.now(), model: modelName }],
        })),
    }),
    {
      name: "factory-storage",
    }
  )
);
```

Esto guarda el estado aunque recargues la pagina.

### 9. Lo que podria caer del Manual 4

Te pueden pedir:

- explicar que es estado global;
- instalar Zustand;
- crear un store;
- usar `create`;
- usar `set`;
- leer datos del store;
- llamar acciones del store;
- explicar por que el componente necesita `"use client"`;
- usar `persist`.

## Resumen general para examen

### Cuando poner `"use client"`

Pon `"use client"` si usas:

- `useState`;
- `useEffect`;
- `onClick`;
- `onChange`;
- formularios interactivos;
- Zustand en componentes;
- `window`;
- `localStorage`.

### Estructura basica de rutas

```txt
app/page.jsx                 -> /
app/contacto/page.jsx        -> /contacto
app/productos/page.jsx       -> /productos
app/productos/[id]/page.jsx  -> /productos/123
```

### Componente basico

```jsx
export default function Tarjeta({ titulo }) {
  return <h2>{titulo}</h2>;
}
```

### Estado basico

```jsx
const [valor, setValor] = useState(0);
```

### Efecto basico

```jsx
useEffect(() => {
  console.log("Se cargo");
}, []);
```

### Layout basico

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

### Link basico

```jsx
<Link href="/produccion">Produccion</Link>
```

### Imagen basica

```jsx
<Image src={foto} alt="Descripcion" />
```

### Ruta dinamica

```txt
app/items/[id]/page.jsx
```

```jsx
export default async function Page({ params }) {
  const { id } = await params;
  return <h1>{id}</h1>;
}
```

### Store basico con Zustand

```jsx
import { create } from "zustand";

export const useStore = create((set) => ({
  contador: 0,
  sumar: () => set((state) => ({ contador: state.contador + 1 })),
}));
```

## Checklist antes de entregar

- La app arranca con `npm run dev`.
- No hay imports rotos.
- Las rutas existen dentro de `app`.
- Los componentes interactivos tienen `"use client"`.
- Las props tienen el mismo nombre al enviar y recibir.
- Si usas imagen externa, el dominio esta en `next.config.mjs`.
- Si usas `.env.local`, no subes claves secretas.
- Si usas rutas dinamicas, lees `params`.
- Si usas Zustand, instalaste `zustand`.
- El build funciona con `npm run build`.
