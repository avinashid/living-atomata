import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/conway", "routes/conway/page.tsx"),
] satisfies RouteConfig;
