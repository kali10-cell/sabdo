"use client";

import { useEffect, useState } from "react";

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const [nombre, setNombre] = useState("");

  const cargarFavoritos = async () => {
    const res = await fetch("/api/favoritos");
    const data = await res.json();
    setFavoritos(data);
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const agregarFavorito = async (e) => {
    e.preventDefault();

    await fetch("/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Date.now(), nombre }),
    });

    setNombre("");
    await cargarFavoritos();
  };

  return (
    <main className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Favoritos</h1>

      <form onSubmit={agregarFavorito} className="flex gap-2 flex-wrap">
        <input
          className="border p-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del favorito"
        />
        <button className="border px-3" type="submit">
          Añadir
        </button>
      </form>

      <section className="flex flex-col gap-2">
        {favoritos.map((f) => (
          <div key={f.id} className="border p-2">
            {f.nombre}
          </div>
        ))}
      </section>
    </main>
  );
}

