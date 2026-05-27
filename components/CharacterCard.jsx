"use client";

import Image from "next/image";

export default function CharacterCard({ id, name, status, species, image }) {
  return (
    <article className="border rounded p-3 flex flex-col gap-2" data-id={id}>
      <Image src={image} alt={name} width={200} height={200} />
      <h2 className="font-semibold">{name}</h2>
      <p>
        {status} - {species}
      </p>
    </article>
  );
}

