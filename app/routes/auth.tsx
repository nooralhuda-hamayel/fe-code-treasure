import type { Route } from "./+types/home"; // إن وجد
import AuthPage from "~/src/pages/AuthPage"; // المسار حسب مكان الملف

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth" },
    { name: "description", content: "Sign in and Sign up page" },
  ];
}

export default function Auth() {
  return <AuthPage />;
}



