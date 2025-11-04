// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { sendForgot } from "../api/password"; // on crée dessous

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await sendForgot(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur");
    }
  };

  if (sent) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-3">Email envoyé</h2>
        <p>Si cet email existe, tu recevras un lien pour réinitialiser le mot de passe.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Mot de passe oublié</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" type="email" required />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer le lien</button>
    </form>
  );
}
