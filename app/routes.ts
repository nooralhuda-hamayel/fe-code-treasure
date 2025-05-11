

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("health-check", "./routes/health-check.tsx"),
    route("levels", "./src/pages/LevelsPage.tsx"), 
    route("auth", "./src/pages/AuthPage.tsx")

] satisfies RouteConfig;



