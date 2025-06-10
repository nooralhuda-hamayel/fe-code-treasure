import { type RouteConfig, route } from "@react-router/dev/routes";

export const dashboardRoutesConfig = {
    public: [],
    protected: [
        route("dashboard", "features/dashboard/containers/DashboardPage.tsx"),
    ]
}; 