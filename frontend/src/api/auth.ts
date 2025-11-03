import api from "./axios";

// Récupère le cookie CSRF
export async function getCsrfCookie() {
  return api.get("/sanctum/csrf-cookie");
}

// Connexion
export async function login(email: string, password: string) {
  await getCsrfCookie();
  const { data } = await api.post("/api/login", { email, password });
  return data;
}

// Déconnexion
export async function logout() {
  const { data } = await api.post("/api/logout");
  return data;
}

// Récupération de l'utilisateur connecté
export async function getUser() {
  const { data } = await api.get("/api/me");
  return data;
}
