// frontend/src/api/quotes.ts
import api from "./axios";
import type { AxiosResponse } from "axios";

export interface Quote {
  id: number;
  type: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  devices?: any;
  notes?: string;
  details?: any;
  file_path?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/** Create simple (electronic) quote */
export async function createQuote(payload: any, file?: File | null): Promise<Quote> {
  const form = new FormData();
  form.append("type", payload.type || "electronic");
  form.append("client_name", payload.client_name || "");
  form.append("client_phone", payload.client_phone || "");
  form.append("devices", JSON.stringify(payload.devices || []));
  if (file) form.append("file", file);

  const res: AxiosResponse<Quote> = await api.post("/api/quotes", form, {
    headers: { "Accept": "application/json" },
  });
  return res.data;
}

/** Create solar quote */
export async function createSolarQuote(payload: any, file?: File | null): Promise<Quote> {
  const form = new FormData();
  form.append("type", "solar");
  form.append("client_name", payload.client_name || "");
  form.append("site", payload.site || "");
  form.append("required_power", payload.required_power || "");
  form.append("notes", payload.notes || "");
  if (file) form.append("file", file);

  const res: AxiosResponse<Quote> = await api.post("/api/quotes/solar", form, {
    headers: { "Accept": "application/json" },
  });
  return res.data;
}

/** Fetch notifications */
export async function fetchNotifications(): Promise<any> {
  const res = await api.get("/api/notifications");
  return res.data;
}

/** Fetch list of quotes. Returns Quote[]; if you need meta, add another fn. */
export async function fetchQuotes(page?: number): Promise<Quote[]> {
  const options = page ? { params: { page } } : {};
  const res: AxiosResponse = await api.get("/api/quotes", options);

  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data as Quote[];
  }
  if (Array.isArray(res.data)) {
    return res.data as Quote[];
  }
  return (res.data?.data ?? res.data ?? []) as Quote[];
}

export async function fetchQuoteById(id: number): Promise<Quote> {
  const res: AxiosResponse<Quote> = await api.get(`/api/quotes/${id}`);
  return res.data;
}

export async function updateQuoteStatus(id: number, status: string): Promise<Quote> {
  const res: AxiosResponse<Quote> = await api.patch(`/api/quotes/${id}`, { status });
  return res.data;
}
