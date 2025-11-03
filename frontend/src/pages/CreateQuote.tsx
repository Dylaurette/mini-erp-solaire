// src/pages/CreateQuote.tsx
import React, { useState } from "react";
import { createQuote } from "../api/quotes";
import { useNavigate } from "react-router-dom";

type DeviceRow = {
  id: number;
  name: string;
  unit: string; // ex: W, Wh, L, kg
  value: string;
};

export default function CreateQuote() {
  const nav = useNavigate();
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [devices, setDevices] = useState<DeviceRow[]>([{ id: 1, name: "", unit: "W", value: "" }]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const addDevice = () => setDevices(prev => [...prev, { id: Date.now(), name: "", unit: "W", value: "" }]);
  const updateDevice = (id: number, key: keyof DeviceRow, val: any) =>
    setDevices(prev => prev.map(d => d.id === id ? { ...d, [key]: val } : d ));
  const removeDevice = (id: number) => setDevices(prev => prev.filter(d => d.id !== id));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        type: "electronic",
        client_name: clientName,
        client_phone: clientPhone,
        devices: devices.map(d => ({ name: d.name, unit: d.unit, value: d.value })),
      };

      const res = await createQuote(payload, file);
      console.log("Created:", res);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Nouvelle demande de devis (Appareils)</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block">Nom client</label>
          <input className="border p-2 w-full" value={clientName} onChange={e => setClientName(e.target.value)} />
        </div>

        <div>
          <label className="block">Téléphone</label>
          <input className="border p-2 w-full" value={clientPhone} onChange={e => setClientPhone(e.target.value)} />
        </div>

        <div>
          <h3 className="font-semibold">Appareils</h3>
          {devices.map((d) => (
            <div key={d.id} className="flex gap-2 items-center mb-2">
              <input placeholder="Nom appareil" value={d.name} onChange={e => updateDevice(d.id, "name", e.target.value)} className="border p-2 flex-1" />
              <select value={d.unit} onChange={e => updateDevice(d.id, "unit", e.target.value)} className="border p-2">
                <option>W</option>
                <option>Wh</option>
                <option>L</option>
                <option>kg</option>
              </select>
              <input placeholder="Valeur" value={d.value} onChange={e => updateDevice(d.id, "value", e.target.value)} className="border p-2 w-32" />
              <button type="button" onClick={() => removeDevice(d.id)} className="text-red-600">Suppr</button>
            </div>
          ))}
          <button type="button" onClick={addDevice} className="text-blue-600">+ Ajouter appareil</button>
        </div>

        <div>
          <label>Fichier (plans / photo / pdf)</label>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>

        <div>
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>{loading ? "Envoi..." : "Envoyer la demande"}</button>
        </div>
      </form>
    </div>
  );
}
