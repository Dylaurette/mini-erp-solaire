import api from './axios';

export async function login(email: string, password: string) {
  await api.get('/sanctum/csrf-cookie'); // récupère le cookie CSRF
  const { data } = await api.post('/login', { email, password });
  return data;
}

export async function logout() {
  const { data } = await api.post('/logout');
  return data;
}
