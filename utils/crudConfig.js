// Single place to adapt the CRUD to a new exam statement:
// - change `table`
// - change `fields` (keys must match DB column names)
// - optionally change `displayField` / `counterField`

export const CRUD_CONFIG = {
  // Supabase table name
  table: "objetos",

  // UI labels (keep them generic so you can reuse the same app for any entity)
  title: "CRUD",
  itemLabel: "Elemento",

  // Which column to show as the main title in the list
  displayField: "objeto",

  // Optional numeric field used by +1 / -1 buttons
  counterField: "cantidad",

  // Form fields (keys MUST match the DB columns)
  fields: [
    {
      key: "objeto",
      label: "Nombre",
      input: "text",
      required: true,
      defaultValue: "",
      editable: true,
      showInList: true,
      normalize: (v) => String(v ?? "").trim(),
    },
    {
      key: "rareza",
      label: "Tipo",
      input: "text",
      required: false,
      defaultValue: "",
      editable: true,
      showInList: true,
      normalize: (v) => String(v ?? "").trim(),
    },
    {
      key: "cantidad",
      label: "Cantidad",
      input: "number",
      required: true,
      defaultValue: "",
      editable: true,
      showInList: true,
      parse: (v) => {
        if (v == null) return NaN;
        const s = String(v).trim();
        if (s === "") return NaN;
        return Number(s);
      },
    },
    {
      key: "modalidad",
      label: "Modalidad",
      input: "select",
      required: true,
      defaultValue: "online",
      editable: true,
      showInList: true,
      options: [
        { value: "online", label: "Online" },
        { value: "presencial", label: "Presencial" },
      ],
    },

    // Timestamps: in many exams these exist but are NOT typed in the form.
    // If your teacher requires Spanish names, keep them Spanish here and in SQL.
    {
      key: "creado_en",
      label: "Creado en",
      input: "text",
      required: false,
      defaultValue: "",
      editable: false,
      showInList: true,
    },
    {
      key: "actualizado_en",
      label: "Actualizado en",
      input: "text",
      required: false,
      defaultValue: "",
      editable: false,
      showInList: true,
    },
  ],
};
