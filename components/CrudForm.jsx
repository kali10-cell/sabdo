"use client";

import { useEffect, useMemo, useState } from "react";

import { CRUD_CONFIG } from "@/utils/crudConfig";
import { useCrudStore } from "@/store/crudStore";

function buildInitialForm() {
  const initial = {};
  for (const f of CRUD_CONFIG.fields) {
    if (f.editable === false) continue;
    initial[f.key] = f.defaultValue ?? "";
  }
  return initial;
}

function normalizePayload(form) {
  const payload = {};

  for (const f of CRUD_CONFIG.fields) {
    if (f.editable === false) continue;
    let value = form[f.key];

    if (typeof f.normalize === "function") value = f.normalize(value);
    if (typeof f.parse === "function") value = f.parse(value);

    payload[f.key] = value;
  }

  return payload;
}

export default function CrudForm() {
  const initialForm = useMemo(() => buildInitialForm(), []);
  const [form, setForm] = useState(initialForm);

  const createOne = useCrudStore((s) => s.createOne);
  const updateOne = useCrudStore((s) => s.updateOne);
  const deleteOne = useCrudStore((s) => s.deleteOne);
  const editingItem = useCrudStore((s) => s.editingItem);
  const clearEditingItem = useCrudStore((s) => s.clearEditingItem);

  useEffect(() => {
    if (!editingItem) return;

    const next = { ...initialForm };
    for (const f of CRUD_CONFIG.fields) {
      if (f.editable === false) continue;
      const v = editingItem?.[f.key];
      next[f.key] = v == null ? (f.defaultValue ?? "") : String(v);
    }
    setForm(next);
  }, [editingItem, initialForm]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (payload) => {
    for (const f of CRUD_CONFIG.fields) {
      if (f.editable === false) continue;
      if (!f.required) continue;
      const v = payload[f.key];
      if (v == null) return `${f.label} es obligatorio`;
      if (typeof v === "string" && v.trim() === "") return `${f.label} es obligatorio`;
      if (typeof v === "number" && Number.isNaN(v)) return `${f.label} es obligatorio`;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = normalizePayload(form);
    const errorMsg = validate(payload);
    if (errorMsg) {
      // Exam-friendly: quick feedback without extra UI plumbing.
      alert(errorMsg);
      return;
    }

    if (editingItem?.id) {
      await updateOne(editingItem.id, payload);
      clearEditingItem();
    } else {
      await createOne(payload);
    }

    setForm(initialForm);
  };

  const cancel = () => {
    clearEditingItem();
    setForm(initialForm);
  };

  const remove = async () => {
    if (!editingItem?.id) return;
    await deleteOne(editingItem.id);
    cancel();
  };

  return (
    <form onSubmit={onSubmit}>
      {CRUD_CONFIG.fields.filter((f) => f.editable !== false).map((f) => {
        if (f.input === "select") {
          return (
            <select
              key={f.key}
              value={form[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
            >
              {(f.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={f.key}
            type={f.input === "number" ? "number" : "text"}
            placeholder={f.label}
            value={form[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        );
      })}

      <button type="submit">{editingItem ? "Actualizar" : "Guardar"}</button>

      {editingItem ? (
        <>
          <button type="button" className="btn-secondary" onClick={cancel}>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={remove}>
            Eliminar
          </button>
        </>
      ) : null}
    </form>
  );
}
