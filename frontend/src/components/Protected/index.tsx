import { Navigate } from "react-router-dom";

interface ProtectedProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

export default function Protected ({ isLoggedIn, children }: ProtectedProps) {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};