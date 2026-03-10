import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
