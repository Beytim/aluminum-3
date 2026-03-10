import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
