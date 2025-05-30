import DashboardLayout from "../../../layouts/DashboardLayout";
import { fetchUsers } from "../../../features/user/allUserSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCheck,faUsers,faTimesCircle,faDollarSign , faSimCard} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../../../components";
import { paymentInfo } from "../../../features/payment/paymentSlice";
import UserFilters from "../../../components/users/UserFilters";


const AdminDashboardHome = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const loading = useSelector((state) => state.users?.loading);
  const [filterUsers, setFilterUser] = useState([])
  const paymentData = useSelector((state) => state.payment?.paymentData || []);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalSoldESims, setTotalSoldESims] = useState(0);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    dispatch(paymentInfo());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFilter = (filteredList) => {
    setFilterUser(filteredList);
  };
  
  
  useEffect(() => {
    setFilterUser(usersData); 
  }, [usersData]);
  
  useEffect(() => {
    if (paymentData.length > 0 && users.length > 0) {
      let totalPaymentSum = 0;
      let totalEsimsSold = 0;
      let updatedUsers = users.map(user => ({ ...user, totalPayments: 0, totalPurchasedEsims: 0 }));

      paymentData.forEach(payment => {
        totalPaymentSum += payment.amount / 10000;
        totalEsimsSold += payment.packageInfoList.length;

        updatedUsers = updatedUsers.map(user => {
          if (payment.userId._id === user._id) {
            return {
              ...user,
              totalPayments: user.totalPayments + payment.amount / 10000,
              totalPurchasedEsims: user.totalPurchasedEsims + payment.packageInfoList.length,
            };
          }
          return user;
        });
      });

      setTotalPayments(totalPaymentSum.toFixed(2));
      setTotalSoldESims(totalEsimsSold);
      setUsersData(updatedUsers);
    }
  }, [paymentData, users]);

  const totalUsers = usersData.length;
  const verifiedUsers = usersData.filter((user) => user.verified).length;
  const nonVerifiedUsers = totalUsers - verifiedUsers;

  const cards = [
    { icon:  faSimCard, title: "Total eSims Sold", value: totalSoldESims },
    { icon: faDollarSign, title: "Total Payments", value: `$${totalPayments}` },
    { icon: faUsers, title: "Total Users", value: totalUsers },
    { icon:  faUserCheck, title: "Verified Users", value: verifiedUsers },
    { icon:faTimesCircle, title: "Non-verified Users", value: nonVerifiedUsers },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" description="Manage users and system data">
      {loading && <Loader />}
    
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700">Welcome, Admin!</h3>
       <div className="mt-8">
         <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-xs">
              <div className="p-3 mr-4 rounded-full bg-primary text-white">
                <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-lg font-semibold text-gray-700">{card.value}</p>
              </div>
            </div>
          ))}
          
        </div>
        <UserFilters paymentInfo={usersData}  onfilter={handleFilter} />
     <div className="table-container px-4">
         <table className="min-w-full bg-white table-auto max-w-full">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              <th className="px-4 py-3 whitespace-nowrap">User Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 whitespace-nowrap">Account Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Total eSims</th>
              <th className="px-4 py-3 whitespace-nowrap">Total Payment</th>
            </tr>
          </thead>
         
          <tbody className="divide-y">
            {filterUsers.length > 0 ? (
              filterUsers.map((user) => (
                <tr key={user._id}  className="text-gray-700 cursor-pointer hover:bg-gray-100">
                  <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.verified ? (
                      <span className="px-2 py-1 bg-green-200 text-green-700 rounded">Verified</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-200 text-red-700 rounded">Non-verified</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{user.totalPurchasedEsims}</td>
                  <td className="px-4 py-3">${user.totalPayments.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center px-4 py-3">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardHome;
