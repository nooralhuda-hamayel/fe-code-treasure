import { useEffect, useState } from "react";
import { doHealthCheck } from "../../../apis";

export default function HealthCheckPage() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [checking, setIsChecking] = useState(true);
  useEffect(() => {
    doHealthCheck()
      .then((isHealthy) => {
        setIsHealthy(isHealthy);
      })
      .catch((err: any) => {
        setIsHealthy(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  return <h1>{checking ? 'Checking' : isHealthy ? 'Healthy': 'Not healthy'}</h1>;
}