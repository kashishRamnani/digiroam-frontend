import DashboardLayout from "../../../layouts/DashboardLayout";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { paymentInfo } from "../../../features/payment/paymentSlice";
import { Link } from "react-router-dom";
import { faSimCard, faCreditCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import getCurrencySymbol from '../../../utils/helpers/getCurrencySymbol';
import formateDateTime from "../../../utils/helpers/formte.date.time";

const UserDashboardHome = () => {
  const dispatch = useDispatch();
  const { paymentData, loading } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(paymentInfo());

  }, [dispatch]);

  const simOwner = user.name
  // const simOwner = paymentData?.[0]?.payer?.name?.surname || "N/A";
  const totalOrder = paymentData.length;
  const totalPackages =
    paymentData.reduce(
      (sum, payment) =>
        sum +
        (payment.packageInfoList?.reduce((pkgSum, pkg) => pkgSum + pkg.count, 0) || 0),
      0
    ) || 0;
  const totalPayment =
    paymentData.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

  const cards = [
    { icon: faUser, title: "Sim Owner", value: simOwner },
    { icon: faSimCard, title: "Total Esim", value: totalOrder },
    { icon: faCreditCard, title: "Total Packages", value: totalPackages },
    { icon: faCreditCard, title: "Total Payment", value: `$${(totalPayment / 10000).toFixed(2)}` },
  ];

  return (
    <DashboardLayout title="Dashboard" description="Your personal dashboard">
      {loading && <Loader />}
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700">
          Welcome to Roam Digi!
        </h3>
        <div className="mt-8">
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
              <div key={index}
                className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                <div className="p-3 mr-4 rounded-full"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                  }}>
                  <FontAwesomeIcon icon={card.icon} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-lg font-semibold text-gray-700 whitespace-nowrap">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="table-container ">
            <table className="min-w-full bg-white table-auto max-w-full">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Order No</th>
                  <th className="px-4 py-3 ">Amount</th>
                  <th className="px-4 py-3 whitespace-nowrap ">No. of eSIMs</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {paymentData.length > 0 ? (
                  paymentData.map((payment, index) => (
                    <tr key={index} className="text-gray-700 cursor-pointer hover:bg-gray-100">
                      <td className="px-4 py-3">
                        <Link to={`/esims?orderNo=${payment.orderNo}`} className="text-blue-500">
                          {payment.orderNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{getCurrencySymbol(payment.currency)}{(payment.amount / 10000).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {Array.isArray(payment?.packageInfoList) ? payment.packageInfoList.length : 0}
                      </td>
                      <td className="px-4 py-3">{payment.transactionId}</td>
                      <td className="px-4 py-3 whitespace-nowrap ">{formateDateTime(payment.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-3">
                      No payment data available
                    </td>
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

export default UserDashboardHome;
