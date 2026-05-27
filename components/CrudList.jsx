"use client";

import { CRUD_CONFIG } from "@/utils/crudConfig";
import { useCrudStore } from "@/store/crudStore";

export default function CrudList() {
  const items = useCrudStore((s) => s.items);
  const deleteOne = useCrudStore((s) => s.deleteOne);
  const incrementCounter = useCrudStore((s) => s.incrementCounter);
  const decrementCounter = useCrudStore((s) => s.decrementCounter);
  const setEditingItem = useCrudStore((s) => s.setEditingItem);
  const getDisplayValue = useCrudStore((s) => s.getDisplayValue);

  const counterField = CRUD_CONFIG.counterField;

  return (
    <section>
      {items.length === 0 ? (
        <p className="muted-text">No hay registros todavia.</p>
      ) : null}

      {items.map((item) => (
        <article key={item.id}>
          <h2>{getDisplayValue(item)}</h2>

          {CRUD_CONFIG.fields
            .filter((f) => f.showInList !== false)
            .filter((f) => f.key !== CRUD_CONFIG.displayField)
            .map((f) => (
              <p key={f.key}>
                {f.label}: {item?.[f.key] ?? "-"}
              </p>
            ))}

          {counterField ? (
            <>
              <button onClick={() => incrementCounter(item.id)}>+1</button>
              <button onClick={() => decrementCounter(item.id)}>-1</button>
            </>
          ) : null}

          <button onClick={() => setEditingItem(item)}>Editar</button>
          <button onClick={() => deleteOne(item.id)}>Eliminar</button>
        </article>
      ))}
    </section>
  );
}
