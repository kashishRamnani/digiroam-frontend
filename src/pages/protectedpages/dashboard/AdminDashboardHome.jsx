import DashboardLayout from "../../../layouts/DashboardLayout";
import { fetchUsers } from "../../../features/user/allUserSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboardHome = () => {
  const dispatch = useDispatch();
  
  // Correct way to select data from Redux state
  const { user, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <DashboardLayout title="Admin Dashboard" description="Admin personalized dashboard">
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(user, null, 2)}</pre>}
    </DashboardLayout>
  );
};

export default AdminDashboardHome;
