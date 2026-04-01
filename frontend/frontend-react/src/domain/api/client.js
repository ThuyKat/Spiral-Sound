export async function apiClient(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return null;
  return res.json();
}
