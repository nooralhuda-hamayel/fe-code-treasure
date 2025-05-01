
import type { Route } from "./+types/home";
import LevelsPage from "../features/levels/LevelsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Levels" },
    { name: "description", content: "Game Levels Board" },
  ];
}

export default function Levels() {
  return <LevelsPage />;
}
