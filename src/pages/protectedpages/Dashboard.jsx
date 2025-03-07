import DashboardLayout from "../../layouts/DashboardLayout";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataPlan from "./DataPlan";
import {
  faChartBar,
  faShoppingCart,
  faDollarSign,
  faSimCard,
  faTimes,
  faCreditCard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosConfig";

const Dashboard = () => {

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedEsim, setSelectedEsim] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("data");
  
  useEffect(() => {
    const getmyInfo = async () => {
      try {
        const response = await axiosInstance.get("/paymentSave/getMyPaymentInfo");


        if (response.data?.success) {
          setPaymentInfo(response.data);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    getmyInfo();
  }, []);

  const openSidebar = async (orderNo) => {
    try {
      const response = await axiosInstance.post("/esim/allocatedProfiles", {
        orderNo: orderNo,
        pager: { pageNum: 1, pageSize: 10 },
      });

      if (response.data?.success) {
        setSelectedEsim(response.data.data?.esimList?.[0] || null);
        setActiveTab("profile"); 
        setIsSidebarOpen(true);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const closeSidebar = () => {
    setSelectedEsim(null);
    setIsSidebarOpen(false);
  };


  const simOwner = paymentInfo?.myPayments?.[0]?.payer?.name?.surname || "N/A";
  const totalOrder = paymentInfo?.myPayments?.length || 0;
  const totalPackages = paymentInfo?.myPayments?.reduce((sum, payment) => {
    return sum + payment.packageInfoList?.reduce((pkgSum, pkg) => pkgSum + pkg.count, 0);
  }, 0) || 0;
  const totalPayment = paymentInfo?.myPayments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;


  const cards = [
    { icon: faUser, title: "Sim Owner", value: simOwner },
    { icon: faSimCard, title: "Total Esim", value: totalOrder },
    { icon: faCreditCard, title: "Total Packages", value: `${totalPackages}` },
    { icon: faCreditCard, title: "Total Payment", value: `$${totalPayment.toFixed(2) / 1000}` },
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
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {paymentInfo?.myPayments?.length > 0 ? (
                paymentInfo.myPayments.map((payment, index) => (
                  <tr
                    key={index}
                    className="text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => openSidebar(payment.orderNo)}
                  >
                    <td className="px-4 py-3">{payment.orderNo}</td>
                    <td className="px-4 py-3">${(payment.amount / 1000).toFixed(2)}</td>
                    <td className="px-4 py-3">{payment.currency}</td>
                    <td className="px-4 py-3">{payment.transactionId}</td>
                    <td className="px-4 py-3">{payment.status}</td>
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

      {/* Sidebar Popup */}

      {isSidebarOpen && selectedEsim && (
        <div className="fixed inset-0 flex items-center justify-end z-50">
          {/* Overlay - Click to close */}
          <div
            className="bg-gray-900 opacity-50 absolute inset-0 cursor-pointer"
            onClick={closeSidebar}
          ></div>

          {/* Sidebar */}
          <div className="relative w-[32rem] bg-white shadow-2xl h-full p-6 rounded-l-2xl transform transition-transform duration-300 ease-in-out animate-slide-in">
           {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">eSIM Details</h2>
              <button onClick={closeSidebar} className="text-gray-600 hover:text-red-500 transition duration-300">
                <FontAwesomeIcon icon={faTimes} />
              </button>
              </div>
              <div>
      {/* Tabs Navigation */}
      <div className="flex space-x-4 mt-4 border-b">
        {["profile", "DataPlan", "coverage", "action"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition duration-300 ${
              activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4 overflow-y-auto max-h-screen pr-2">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Order No:</strong> {selectedEsim.orderNo}</p>
              <p><strong>eSIM Status:</strong> {selectedEsim.esimStatus}</p>
              <p><strong>Package Name:</strong> {selectedEsim.packageList?.[0]?.packageName || "N/A"}</p>
              <p><strong>Data Volume Left:</strong> {selectedEsim.totalVolume ? `${(selectedEsim.totalVolume / 1024 / 1024).toFixed(2)} MB` : "N/A"}</p>
            </div>

            {/* QR Code & Short URL Section */}
            <div className="mt-4">
              <p className="mb-4">
                <strong>Expired Time:</strong>{" "}
                {selectedEsim.expiredTime ? new Date(selectedEsim.expiredTime).toLocaleString() : "N/A"}
              </p>
              <p className="mb-2">
                <strong>QR Code URL:</strong>{" "}
                <a
                  href={selectedEsim.qrCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition duration-300"
                >
                  View QR Code
                </a>
              </p>
              <p>
                <strong>Short URL:</strong>{" "}
                <a
                  href={selectedEsim.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition duration-300"
                >
                  {selectedEsim.shortUrl || "N/A"}
                </a>
              </p>
            </div>

            {/* QR Code Image */}
            {selectedEsim.qrCodeUrl && (
              <div className="flex justify-center mt-4">
                <img
                  src={selectedEsim.qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 shadow-sm border-2 rounded-lg"
                />
              </div>
            )}
          </>
        )}

        {/* DataPlan Tab */}
        {activeTab === "DataPlan" && <DataPlan selectedEsim={selectedEsim} />}
      </div>
    </div>
 
            

          </div>
        </div>
      )}
      
    </DashboardLayout>
    
  );
};

export default Dashboard;
