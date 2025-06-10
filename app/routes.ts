import { type RouteConfig } from "@react-router/dev/routes";
import { authRoutesConfig } from "./features/auth";
import { homeRoutesConfig } from "./features/home";
import { healthCheckRoutesConfig } from "./features/health-check";
import { dashboardRoutesConfig } from "./features/dashboard";
import { adminRoutesConfig } from "./features/admin";

const moduleRouteConfigs = [
    homeRoutesConfig,
    healthCheckRoutesConfig,
    authRoutesConfig,
    dashboardRoutesConfig,
    adminRoutesConfig
];

export const publicPaths = moduleRouteConfigs.flatMap(config => config.public.map(r => {
    return !r.path ? "/" : `/${r.path}`;
}));

export default [
    ...moduleRouteConfigs.flatMap(config => [...config.public, ...config.protected])
] satisfies RouteConfig;
