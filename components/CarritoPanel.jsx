"use client";

import { useMemo } from "react";

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

export default function CarritoPanel() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const discountPercent = useCartStore((state) => state.discountPercent);
  const setDiscountPercent = useCartStore((state) => state.setDiscountPercent);

  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, p) => sum + Number(p.price || 0), 0);
    const discount = subtotal * (Number(discountPercent || 0) / 100);
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  }, [cart, discountPercent]);

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Carrito</h2>
        <button
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          onClick={clearCart}
        >
          Vaciar
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-slate-600">Descuento</span>
        <select
          className="border border-slate-300 p-2 rounded-lg bg-white"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
        >
          <option value={0}>0%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
        </select>
      </label>

      <div className="text-sm flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Descuento</span>
          <span className="font-medium">-{formatMoney(discount)}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-100">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {cart.length === 0 ? <p className="text-slate-500">Carrito vacío.</p> : null}

        {cart.map((p, idx) => (
          <div
            key={`${p.id}-${idx}`}
            className="border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="truncate font-medium">{p.title}</div>
              <div className="text-sm text-slate-500">
                {formatMoney(Number(p.price || 0))}
              </div>
            </div>
            <button
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
              onClick={() => removeFromCart(p.id)}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

