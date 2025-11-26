import type { Paint } from "./PaintsTypes";
import { PAINTS_MOCK } from "./mock";

export async function listPaints(params?: { title?: string}): Promise<Paint[]> {
  try {
    let path = "api/v1/paints";    
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
    const res = await fetch(`/api/v1/paint/${id}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}