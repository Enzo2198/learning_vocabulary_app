import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export default ProtectedRoute;
