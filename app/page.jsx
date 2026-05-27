"use client";

import { useEffect } from "react";

import CrudForm from "@/components/CrudForm";
import CrudList from "@/components/CrudList";
import { useCrudStore } from "@/store/crudStore";
import { CRUD_CONFIG } from "@/utils/crudConfig";

export default function Home() {
  const fetchAll = useCrudStore((state) => state.fetchAll);
  const loading = useCrudStore((state) => state.loading);
  const error = useCrudStore((state) => state.error);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <main className="inventario">
      <h1>{CRUD_CONFIG.title}</h1>

      <CrudForm />

      {loading ? <p>Cargando...</p> : null}
      {error ? (
        <p className="error-text">Error: {String(error.message ?? error)}</p>
      ) : null}

      <CrudList />
    </main>
  );
}

