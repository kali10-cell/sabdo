"use client";

import Link from "next/link";

import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const total = useCartStore((state) => state.cart.length);

  return (
    <header className="w-full border-b p-4 flex flex-wrap items-center justify-between gap-4">
      <nav className="flex flex-wrap gap-4">
        <Link href="/" className="underline">
          Inventario
        </Link>
        <Link href="/login" className="underline">
          Login
        </Link>
        <Link href="/productos" className="underline">
          Productos
        </Link>
        <Link href="/favoritos" className="underline">
          Favoritos
        </Link>
        <Link href="/personajes" className="underline">
          Personajes
        </Link>
      </nav>

      <div className="font-semibold">Carrito: {total}</div>
    </header>
  );
}
