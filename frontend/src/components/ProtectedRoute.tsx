// frontend/src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[]; // Exemple : ["admin", "manager"]
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // 1) Pendant chargement : affichage propre
  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-600">
        Chargement de votre session...
      </div>
    );
  }

  // 2) Pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3) Gestion des rôles
  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 text-red-600 font-semibold text-center">
        🔐 Accès refusé — rôle requis :{" "}
        <span className="text-black">{allowedRoles.join(", ")}</span>
      </div>
    );
  }

  // 4) OK → accès à la page
  return <>{children}</>;
}
