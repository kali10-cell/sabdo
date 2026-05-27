"use client";

import { useEffect, useState } from "react";

import CharacterList from "@/components/CharacterList";

export default function PersonajesPage() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("https://rickandmortyapi.com/api/character");
        const data = await res.json();
        setCharacters(data.results ?? []);
      } catch (e) {
        console.log(e);
      }
    };

    cargar();
  }, []);

  return (
    <main className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Personajes de Rick & Morty</h1>
      <CharacterList characters={characters} />
    </main>
  );
}

