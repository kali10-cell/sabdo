# Snippets: UI antes de API (para examen)

Idea clave:
- React pinta lo que hay en **estado**.
- Si cambias el estado, se re-renderiza y se ve en pantalla.

## 1) Estado local (sin Supabase)

```jsx
"use client";

import { useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);

  const crear = (nuevo) => {
    setItems((prev) => [...prev, { id: Date.now(), ...nuevo }]);
  };

  return (
    <main>
      <Formulario onCreate={crear} />
      <Lista items={items} />
    </main>
  );
}
```

## 2) Pasar a API (Supabase) sin cambiar "como pinta"

```jsx
// en vez de crear() con setItems directo, haces:
// 1) INSERT en Supabase
// 2) cuando vuelve, guardas el resultado en estado/store

const crear = async (payload) => {
  const creado = await createOne(payload); // store o llamada directa a Supabase
  if (creado) setItems((prev) => [...prev, creado]);
};
```

## 3) Dos estilos posibles

1. Pintar *despues* de respuesta (lo mas simple para examen):
- esperas a que Supabase responda
- anades el item devuelto al estado/store

2. Pintado optimista (solo si te lo piden):
- lo metes en pantalla antes de la respuesta
- si falla, lo quitas y muestras error

