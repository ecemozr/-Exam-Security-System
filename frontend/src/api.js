export const API = "http://localhost:5050";

export function getToken() {
    return localStorage.getItem("token") || "";
}

export async function api(path, { method="GET", headers={}, body } = {}) {
    const token = getToken();
    const h = { ...headers };
    if (token) h["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { method, headers: h, body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
}
