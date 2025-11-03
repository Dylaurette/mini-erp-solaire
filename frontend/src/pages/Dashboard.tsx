// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchNotifications } from "../api/quotes";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchNotifications();
        setNotes(data || []);
      } catch (e) {
        setNotes([]);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">Bonjour, {user?.name || user?.email}</span>
          <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Déconnexion</button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-3">Demandes de devis</h2>
          <div className="mb-4">
            <Link to="/quotes/create" className="text-white bg-blue-600 px-3 py-2 rounded">Nouvelle demande (Appareil)</Link>
            <Link to="/quotes/create-solar" className="ml-3 text-white bg-green-600 px-3 py-2 rounded">Nouvelle demande (Solaire)</Link>
          </div>

          <p>Liste principale des demandes (à implémenter côté backend pagination)</p>
        </div>

        <aside className="p-4 bg-white rounded shadow">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notes.length === 0 && <p>Aucune notification</p>}
          <ul>
            {notes.map((n) => (
              <li key={n.id} className="border-b py-2">
                <div className="text-sm">{n.message}</div>
                <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
