// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      // Si login() redirige déjà selon rôle, tu n'as pas besoin de nav(...)
      // Mais on garde nav("/dashboard") en fallback si login() ne redirige pas.
      await login(email, password);
      // fallback : si login() ne redirige pas, aller au dashboard
      nav("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <label className="block mb-2">
          <span className="text-sm text-gray-600">Email</span>
          <input
            className="w-full p-2 border rounded mt-1"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>

        <label className="block mb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mot de passe</span>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</Link>
          </div>
          <input
            className="w-full p-2 border rounded mt-1"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded mt-4" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="text-sm text-gray-500 mt-3">
          <span>Vous n'avez pas de compte ? </span>
          <Link to="/register" className="text-blue-600 hover:underline">Demander un compte</Link>
        </div>
      </form>
    </div>
  );
}
