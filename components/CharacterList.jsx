import CharacterCard from "@/components/CharacterCard";

export default function CharacterList({ characters }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map((c) => (
        <CharacterCard
          key={c.id}
          id={c.id}
          name={c.name}
          status={c.status}
          species={c.species}
          image={c.image}
        />
      ))}
    </section>
  );
}

