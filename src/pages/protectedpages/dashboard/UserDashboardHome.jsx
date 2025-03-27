import DashboardLayout from "../../../layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { paymentInfo} from "../../../features/payment/paymentSlice"
import { Link } from "react-router-dom";
import {
  faChartBar,
  faShoppingCart,
  faDollarSign,
  faSimCard,
  faTimes,
  faCreditCard,
  faUser,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../../utils/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { retrieveSettings } from "../../../features";



const UserDashboardHome = () => {
  const [paymentInfo, setPaymentInfo] = useState(null);
 

  const dispatch = useDispatch();
  const { pricePercentage } = useSelector(state => state.settings);

  useEffect(() => {
    dispatch(retrieveSettings());

    (async () => {
      try {
        const response = await axiosInstance.get("/paymentSave/getMyPaymentInfo");

        if (response.data?.success) {
          setPaymentInfo(response.data);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    })();
  }, []);

  

  

  const simOwner = paymentInfo?.myPayments?.[0]?.payer?.name?.surname || "N/A";
  const totalOrder = paymentInfo?.myPayments?.length || 0;
  const totalPackages =
    paymentInfo?.myPayments?.reduce((sum, payment) => {
      return (
        sum +
        payment.packageInfoList?.reduce((pkgSum, pkg) => pkgSum + pkg.count, 0)
      );
    }, 0) || 0;
  const totalPayment =
    paymentInfo?.myPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) ||
    0;

  const cards = [
    { icon: faUser, title: "Sim Owner", value: simOwner },
    { icon: faSimCard, title: "Total Esim", value: totalOrder },
    { icon: faCreditCard, title: "Total Packages", value: totalPackages },
    { icon: faCreditCard, title: "Total Payment", value: `$${(totalPayment / 10000).toFixed(2)}` },
  ];

  return (
    <DashboardLayout title="Dashboard" description="Your personal dashboard">
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700">
          Welcome to Roam Digi!
        </h3>
        <div className="mt-8">
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-white rounded-lg shadow-xs"
              >
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
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                <th className="px-4 py-3">Order No</th>

                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">No.of eSIMs</th>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Transaction ID</th>
               
                <th className="px-4 py-3">Date</th>


              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {paymentInfo?.myPayments?.length > 0 ? (
                paymentInfo.myPayments.map((payment, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 cursor-pointer hover:bg-gray-100"


                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/esims?orderNo=${payment.orderNo}`}
                        className="text-blue-500 "
                      >
                        {payment.orderNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      ${(payment.amount / 10000).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{Array.isArray(payment?.packageInfoList) ? payment.packageInfoList.length : 0}</td>
                    <td className="px-4 py-3">{payment.currency}</td>
                    <td className="px-4 py-3">{payment.transactionId}</td>
                  

                    <td className="px-4 py-3">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
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

     
    </DashboardLayout>
  );
};

export default UserDashboardHome;