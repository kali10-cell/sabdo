"use client";

import { create } from "zustand";

import { supabase } from "@/utils/supabase/client";
import { CRUD_CONFIG } from "@/utils/crudConfig";

const TABLE = CRUD_CONFIG.table;
const DISPLAY_FIELD = CRUD_CONFIG.displayField;
const COUNTER_FIELD = CRUD_CONFIG.counterField;

function isMissingColumnError(err, column) {
  const msg = String(err?.message ?? "");
  return msg.includes(`Could not find the '${column}' column`) || msg.includes(`'${column}' column`);
}

function missingColumnHelp(column) {
  // Keep this short and copy/paste-friendly for an exam.
  return {
    message:
      `Falta la columna '${column}' en la tabla '${TABLE}'. ` +
      `Solucion (Supabase SQL Editor): alter table public.${TABLE} add column if not exists ${column} text default 'online'; ` +
      `Luego: notify pgrst, 'reload schema';`,
  };
}

function getDisplayValue(item) {
  const v = item?.[DISPLAY_FIELD];
  return v == null || v === "" ? "-" : String(v);
}

export const useCrudStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  editingItem: null,

  getDisplayValue,

  setEditingItem: (item) => set({ editingItem: item }),
  clearEditingItem: () => set({ editingItem: null }),

  fetchAll: async () => {
    set({ loading: true, error: null });

    const { data, error } = await supabase.from(TABLE).select("*");

    if (error) {
      console.log(error);
      set({ loading: false, error });
      return;
    }

    set({ items: data ?? [], loading: false });
  },

  createOne: async (payload) => {
    set({ error: null });

    let { data, error } = await supabase.from(TABLE).insert([payload]).select();

    // Common exam gotcha: table was created without a new column and PostgREST cache is stale.
    // If we see the missing-column error, retry without that column so the UI still works,
    // and show a clear message about how to fix it in Supabase.
    if (error && isMissingColumnError(error, "modalidad") && payload?.modalidad != null) {
      const { modalidad, ...rest } = payload;
      const retry = await supabase.from(TABLE).insert([rest]).select();
      data = retry.data;
      error = retry.error;
      set({ error: missingColumnHelp("modalidad") });
    }

    if (error) {
      console.log(error);
      set({ error });
      return null;
    }

    const created = data?.[0] ?? null;
    if (created) {
      set((state) => ({ items: [...state.items, created] }));
    }
    return created;
  },

  updateOne: async (id, changes) => {
    set({ error: null });

    let { data, error } = await supabase
      .from(TABLE)
      .update(changes)
      .eq("id", id)
      .select();

    if (error && isMissingColumnError(error, "modalidad") && changes?.modalidad != null) {
      const { modalidad, ...rest } = changes;
      const retry = await supabase.from(TABLE).update(rest).eq("id", id).select();
      data = retry.data;
      error = retry.error;
      set({ error: missingColumnHelp("modalidad") });
    }

    if (error) {
      console.log(error);
      set({ error });
      return null;
    }

    const updated = data?.[0] ?? null;
    if (updated) {
      set((state) => ({
        items: state.items.map((it) => (it.id === id ? updated : it)),
      }));
    }
    return updated;
  },

  deleteOne: async (id) => {
    set({ error: null });

    const { error } = await supabase.from(TABLE).delete().eq("id", id);

    if (error) {
      console.log(error);
      set({ error });
      return false;
    }

    set((state) => ({ items: state.items.filter((it) => it.id !== id) }));
    return true;
  },

  // Generic helper used by +/- buttons (optional).
  setCounterValue: async (id, value) => {
    if (!COUNTER_FIELD) return false;

    set({ error: null });

    const { data, error } = await supabase
      .from(TABLE)
      .update({ [COUNTER_FIELD]: value })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      set({ error });
      return false;
    }

    const updatedValue = data?.[0]?.[COUNTER_FIELD] ?? value;
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, [COUNTER_FIELD]: updatedValue } : it
      ),
    }));
    return true;
  },

  incrementCounter: async (id) => {
    if (!COUNTER_FIELD) return false;
    const item = get().items.find((it) => it.id === id);
    if (!item) return false;

    const current = Number(item[COUNTER_FIELD] ?? 0);
    return await get().setCounterValue(id, current + 1);
  },

  decrementCounter: async (id) => {
    if (!COUNTER_FIELD) return false;
    const item = get().items.find((it) => it.id === id);
    if (!item) return false;

    const current = Number(item[COUNTER_FIELD] ?? 0);
    return await get().setCounterValue(id, Math.max(0, current - 1));
  },
}));
