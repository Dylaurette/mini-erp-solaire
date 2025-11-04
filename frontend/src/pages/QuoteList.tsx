// frontend/src/pages/QuoteList.tsx
import React, { useEffect, useState } from "react";
import { fetchQuotes, Quote } from "../api/quotes";

export default function QuoteList() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchQuotes();
        setQuotes(list || []);
      } catch (err: any) {
        console.error("fetchQuotes error:", err);
        setError(err?.response?.data?.message ?? "Impossible de charger les demandes");
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Demandes de devis</h2>
      {quotes.length === 0 && <p>Aucune demande pour l'instant.</p>}
      <ul>
        {quotes.map((q) => (
          <li key={q.id} className="p-3 border rounded mb-2 bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{q.type} — {q.client_name ?? "—"}</div>
                <div className="text-sm text-gray-600">{q.client_phone ?? q.client_email ?? ""}</div>
              </div>
              <div className="text-sm text-gray-500">{q.created_at ? new Date(q.created_at).toLocaleString() : ""}</div>
            </div>
            <div className="mt-2 text-sm">{q.notes ? q.notes : (q.devices ? JSON.stringify(q.devices) : "")}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
