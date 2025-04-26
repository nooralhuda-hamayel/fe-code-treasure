import type { Route } from "./+types/home";
import { HealthCheck as HealthCheckContainer } from "../features/health-check/containers/health-check/health-check";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Health check" },
    { name: "description", content: "Checking app health" },
  ];
}

export default function HealthCheck() {
  return <HealthCheckContainer />;
}
