"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/utils/supabase/client";

function isValidEmail(value) {
  const v = String(value ?? "").trim();
  // Simple exam-friendly email check (good enough for UI validation).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function LoginForm() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const email = correo.trim();
    if (!isValidEmail(email)) {
      setError("Correo invalido.");
      return;
    }
    if (String(contrasena).length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // En examen normalmente basta con redirigir o mostrar "ok".
      router.push("/");
      router.refresh();
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="login-form">
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Contrasena"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        autoComplete="current-password"
      />

      <button type="submit" disabled={cargando}>
        {cargando ? "Entrando..." : "Entrar"}
      </button>

      {error ? <p className="error-text">Error: {error}</p> : null}
    </form>
  );
}

