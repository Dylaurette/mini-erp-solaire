// src/api/quotes.ts
import api from "./axios";

export async function createQuote(payload: any, file?: File | null) {
  const form = new FormData();
  form.append("type", payload.type || "electronic");
  form.append("client_name", payload.client_name || "");
  form.append("client_phone", payload.client_phone || "");
  form.append("devices", JSON.stringify(payload.devices || []));
  if (file) form.append("file", file);

  const { data } = await api.post("/api/quotes", form);
  return data;
}

export async function createSolarQuote(payload: any, file?: File | null) {
  const form = new FormData();
  form.append("type", "solar");
  form.append("client_name", payload.client_name || "");
  form.append("site", payload.site || "");
  form.append("required_power", payload.required_power || "");
  form.append("notes", payload.notes || "");
  if (file) form.append("file", file);

  const { data } = await api.post("/api/quotes/solar", form);
  return data;
}

export async function fetchNotifications() {
  const { data } = await api.get("/api/notifications");
  return data;
}
