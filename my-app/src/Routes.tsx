export const ROUTES = {
  HOME: "/",
  PAINTS: "/paints",
  PAINT: "/paint/:id"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  PAINTS: "Краски",
  PAINT: "Краска"
};