import DashboardLayout from "../../../layouts/DashboardLayout";
import { fetchUsers } from "../../../features/user/allUserSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../../../components";
import { paymentInfo } from "../../../features/payment/paymentSlice";

const AdminDashboardHome = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users?.users?.users || []);
  const loading = useSelector((state) => state.users?.loading);
  const { paymentData } = useSelector((state) => state.payment);
  const myPayments = paymentData?.myPayments || [];

  useEffect(() => {
   
    dispatch(paymentInfo())
    dispatch(fetchUsers());
  }, [dispatch]);
 
  
  const totalUsers = users.length;
  const verifiedUsers = users.filter((user) => user.verified).length;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const totalPayment = myPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  const cards = [
    { icon: faUsers, title: "Total Users", value: totalUsers },
    { icon: faUser, title: "Verified Users", value: verifiedUsers },
    { icon: faUser, title: "Unverified Users", value: unverifiedUsers },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" description="Manage users and system data">
      {loading && <Loader />}

      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700 mb-6">Welcome, Admin!</h3>

        {/* Cards Section */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-md">
              <div
                className="p-3 mr-4 rounded-full"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-lg font-semibold text-gray-700">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Table */}
        <table className="w-full border-collapse bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Account Status</th>
              <th className="px-4 py-3">Total Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="text-gray-700 hover:bg-gray-100">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.verified ? (
                      <span className="px-2 py-1 bg-green-200 text-green-700 rounded">Verified</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-200 text-red-700 rounded">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3"> ${totalPayment}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-3">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardHome;
