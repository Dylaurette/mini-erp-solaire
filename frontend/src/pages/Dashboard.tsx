import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Bienvenue {user?.name}
        </h1>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold mb-2">Notifications</h2>
          <p>Aucune notification pour l’instant.</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-bold mb-2">Demandes de devis</h2>
          <p>Les demandes apparaîtront ici.</p>
        </div>
      </div>
    </div>
  );
}
