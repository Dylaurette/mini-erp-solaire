// src/pages/CreateSolarQuote.tsx
import React, { useState } from "react";
import { createSolarQuote } from "../api/quotes";
import { useNavigate } from "react-router-dom";

export default function CreateSolarQuote() {
  const nav = useNavigate();
  const [clientName, setClientName] = useState("");
  const [site, setSite] = useState("");
  const [requiredPower, setRequiredPower] = useState(""); // ex: W
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { client_name: clientName, site, required_power: requiredPower, notes };
      await createSolarQuote(payload, file);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erreur");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Demande de devis — Équipement solaire</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
        <input className="w-full border p-2" placeholder="Nom client" value={clientName} onChange={e => setClientName(e.target.value)} />
        <input className="w-full border p-2" placeholder="Site / Ville" value={site} onChange={e => setSite(e.target.value)} />
        <input className="w-full border p-2" placeholder="Puissance requise (W)" value={requiredPower} onChange={e => setRequiredPower(e.target.value)} />
        <textarea className="w-full border p-2" placeholder="Notes techniques" value={notes} onChange={e => setNotes(e.target.value)} />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">{loading ? "..." : "Envoyer la demande"}</button>
      </form>
    </div>
  );
}
