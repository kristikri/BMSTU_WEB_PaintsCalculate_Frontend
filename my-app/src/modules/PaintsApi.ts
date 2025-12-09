import type { Paint } from "./PaintsTypes";
import { PAINTS_MOCK } from "./mock";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function listPaints(params?: { title?: string}): Promise<Paint[]> {
  try {
    let path = apiBaseUrl + "/paints";    
    if (params) {
      const query = new URLSearchParams();
      if (params.title) query.append("title", params.title);
      const queryString = query.toString();
      if (queryString) path += `?${queryString}`;
    }
    const res = await fetch(path, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('API недоступен, используем моки');
    let filteredMock = PAINTS_MOCK;
    if (params?.title) {
      filteredMock = PAINTS_MOCK.filter(paint =>
        paint.title.toLowerCase().includes(params.title!.toLowerCase())
      );
    }
    return filteredMock;
  }
}

export async function getPaint(id: number): Promise<Paint | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/paint/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}