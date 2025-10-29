import type { Paint } from "./PaintsTypes";

export async function listPaints(params?: { title?: string; date_from?: string; date_to?: string }): Promise<Paint[]> {
  try {
    let path = "/api/v1/paints";
    if (params) {
      const query = new URLSearchParams();
      if (params.title) query.append("paint_title", params.title);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }

    const res = await fetch(path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPaint(id: number): Promise<Paint | null> {
  try {
    const res = await fetch(`/api/v1/paint/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}