import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasRole("admin") && !hasRole("manager")) return <Navigate to="/" replace />;

  return <>{children}</>;
}
