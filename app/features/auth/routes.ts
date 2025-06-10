import { route } from "@react-router/dev/routes";

export const authRoutesConfig = {
    public: [
        route("login", "features/auth/containers/LoginPage.tsx"),
        route("logout", "features/auth/containers/LogoutPage.tsx")
    ],
    protected: []
}; 