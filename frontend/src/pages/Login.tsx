import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (e: any) {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Connexion – Mini ERP Solaire
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">{error}</div>}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
