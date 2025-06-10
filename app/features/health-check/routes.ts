import { type RouteConfig, route } from "@react-router/dev/routes";

export const healthCheckRoutesConfig = {
    public: [
        route("health-check", "features/health-check/containers/HealthCheckPage.tsx"),
    ],
    protected: []
};