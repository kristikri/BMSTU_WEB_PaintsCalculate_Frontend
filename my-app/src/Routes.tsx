export const ROUTES = {
  HOME: "/",
  PAINTS: "/paints",
  PAINT: "/paint/:id",
  PROFILE:"/users/:login/info",
  LOGIN: "/login", 
  REGISTER: "/register",
  CALCULATE:"/calculate/:id",
  CALCULATES:"/calculates",
  MODERATOR:"/moderator"
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  PAINTS: "Краски",
  PAINT: "Краска",
  PROFILE:"Личный кабинет",
  CALCULATES:"Рассчеты",
  CALCULATE:"Рассчет",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  MODERATOR:"Модератор"
};