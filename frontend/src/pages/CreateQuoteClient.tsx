// frontend/src/pages/CreateQuoteClient.tsx
import React, { useState } from "react";
import { createQuote } from "../api/quotes";

export default function CreateQuoteClient() {
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [details, setDetails] = useState([{ name: "", value: "" }]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const addRow = () => setDetails([...details, { name: "", value: "" }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("type", "client");
      fd.append("client_name", clientName);
      fd.append("client_contact", clientContact);
      fd.append("details", JSON.stringify(details));
      if (file) fd.append("attachment", file);
      await createQuote(fd);
      alert("Demande envoyée");
    } catch (err) {
      console.error(err);
      alert("Erreur");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded">
      <h2 className="text-lg font-bold mb-4">Nouvelle demande (Appareil)</h2>
      <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Nom client" className="border p-2 mb-2 w-full" />
      <input value={clientContact} onChange={e=>setClientContact(e.target.value)} placeholder="Contact" className="border p-2 mb-2 w-full" />

      <div className="mb-2">
        <label className="block font-semibold">Appareils / Capacités</label>
        {details.map((d, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={d.name} onChange={e=> {
                const n = [...details]; n[i].name = e.target.value; setDetails(n);
            }} placeholder="Appareil" className="border p-2 flex-1" />
            <input value={d.value} onChange={e=> {
                const n = [...details]; n[i].value = e.target.value; setDetails(n);
            }} placeholder="Valeur (W, Wh, kg...)" className="border p-2 w-48" />
          </div>
        ))}
        <button type="button" onClick={addRow} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Ajouter</button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Fichier (schema / photo)</label>
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
      </div>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? "Envoi..." : "Envoyer la demande"}
      </button>
    </form>
  );
}
