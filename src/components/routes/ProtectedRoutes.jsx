import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole, accountType } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (userRole === 2 && accountType === 2) {
    return children; 
  }

  if (userRole === 1 && accountType === 1) {
    return children; 
  }


  return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
