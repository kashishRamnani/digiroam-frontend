import { useAuth } from "../../hooks";
import AdminDashboardHome from "./dashboard/AdminDashboardHome";
import UserDashboardHome from "./dashboard/UserDashboardHome";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const dashboards = {
    1: <UserDashboardHome />,
    2: <AdminDashboardHome />,
  };

  return dashboards[user.accountType] ?? null;
};

export default Dashboard;
