import { useAuth } from "../../hooks";
import AdminDashboardHome from "./dashboard/AdminDashboardHome";
import UserDashboardHome from "./dashboard/UserDashboardHome";
import ESimPlans from "./ESimPlans";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  if (!!JSON.parse(localStorage.getItem("purchasePending") || "null")) {
    return <ESimPlans />
  }

  const dashboards = {
    1: <UserDashboardHome />,
    2: <AdminDashboardHome />,
  };

  return dashboards[user.accountType] ?? null;
};

export default Dashboard;
