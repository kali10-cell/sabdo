import ProductoCard from "@/components/ProductoCard";
import CarritoPanel from "@/components/CarritoPanel";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });
  const productos = await res.json();

  return (
    <main className="mx-auto w-full max-w-6xl p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Tienda</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {productos.map((p) => (
            <ProductoCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              image={p.image}
              description={p.description}
            />
          ))}
        </section>

        <div className="lg:sticky lg:top-4">
          <CarritoPanel />
        </div>
      </div>
    </main>
  );
}
