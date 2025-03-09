import type { Route } from "./+types/home";
import { Home as HomeComp } from "../features/landing-pages/containers/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomeComp />;
}
