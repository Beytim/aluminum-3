import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Block unapproved users
  if (profile && !profile.approved) {
    return <PendingApproval onSignOut={() => { }} />;
  }

  return <>{children}</>;
}

function PendingApproval({ onSignOut }: { onSignOut: () => void }) {
  const { signOut } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">Account Pending Approval</h2>
        <p className="text-sm text-muted-foreground">
          Your account has been created but needs to be approved by an administrator before you can access the system.
        </p>
        <p className="text-xs text-muted-foreground">
          Please contact your company administrator to get approved.
        </p>
        <button
          onClick={signOut}
          className="mt-4 px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
