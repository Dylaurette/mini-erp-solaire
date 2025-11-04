// src/pages/ResetPassword.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { submitReset } from "../api/password";

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token = search.get("token") || "";
  const emailParam = search.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await submitReset({ token, email, password, password_confirmation: passwordConfirmation });
      nav("/login", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur");
    }
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Réinitialiser le mot de passe</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" type="email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Nouveau mot de passe" type="password" className="w-full p-2 border rounded mb-3" required />
      <input value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Confirmer le mot de passe" type="password" className="w-full p-2 border rounded mb-3" required />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Valider</button>
    </form>
  );
}
