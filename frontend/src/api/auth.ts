// src/api/auth.ts
import api from "./axios";

/**
 * getCsrfCookie : si tu utilises Sanctum côté Laravel, il faut d'abord récupérer le cookie CSRF
 * login : envoie les credentials au backend
 */
export async function getCsrfCookie() {
  // endpoint Laravel : /sanctum/csrf-cookie
  await api.get("/sanctum/csrf-cookie");
}

export async function loginApi(email: string, password: string) {
  // assure-toi que axios a withCredentials: true dans axios.ts
  await getCsrfCookie();
  const { data } = await api.post("/login", { email, password });
  // data attendu : { user: {...}, token?: "..."} selon ton backend
  return data;
}

export async function logoutApi() {
  const { data } = await api.post("/logout");
  return data;
}

export async function meApi() {
  const { data } = await api.get("/me");
  return data;
}
