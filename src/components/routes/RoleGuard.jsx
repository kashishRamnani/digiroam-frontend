import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RoleGuard = ({ userRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || user.userRole !== userRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleGuard;
