// src/api/password.ts
import api from "./axios";

/**
 * sendForgot(email) -> POST /forgot-password (Laravel Fortify default)
 * submitReset(payload) -> POST /reset-password (payload: token,email,password,password_confirmation)
 *
 * Si ton backend utilise des endpoints différents, adapte l'URL.
 */
export async function sendForgot(email: string) {
  const { data } = await api.post("/forgot-password", { email });
  return data;
}

export async function submitReset(payload: { token: string; email: string; password: string; password_confirmation: string; }) {
  const { data } = await api.post("/reset-password", payload);
  return data;
}
