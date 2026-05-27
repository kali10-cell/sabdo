"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { useCartStore } from "@/store/cartStore";

function formatMoney(value) {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  } catch {
    return `${value.toFixed(2)} €`;
  }
}

export default function ProductoCard({ id, title, price, image, description }) {
  const [verDetalles, setVerDetalles] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const priceText = useMemo(() => formatMoney(Number(price || 0)), [price]);

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="shrink-0 bg-slate-50 border border-slate-100 rounded-lg p-2">
          <Image src={image} alt={title} width={110} height={110} />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold leading-snug">{title}</h2>
          <p className="mt-1 font-semibold">{priceText}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
          onClick={() => setVerDetalles((v) => !v)}
        >
          Ver detalles
        </button>

        <button
          className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          onClick={() => addToCart({ id, title, price, image })}
        >
          Añadir al carrito
        </button>

        <button
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          onClick={() => removeFromCart(id)}
        >
          Quitar
        </button>
      </div>

      {verDetalles ? (
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      ) : null}
    </article>
  );
}

