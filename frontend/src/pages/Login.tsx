// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      nav("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Connexion</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <input className="w-full border p-2 mb-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-4" placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
