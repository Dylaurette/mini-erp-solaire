// frontend/src/pages/Forbidden.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg text-center bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-red-600">403 — Accès refusé</h1>
        <p className="mb-4">
          Vous n’avez pas la permission d'accéder à cette ressource.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="px-4 py-2 bg-gray-200 rounded">Accueil</Link>
        </div>
      </div>
    </div>
  );
}
