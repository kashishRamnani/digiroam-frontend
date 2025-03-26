import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShoppingCart, faPlusCircle, faSimCard, faChartBar } from "@fortawesome/free-solid-svg-icons";
import DataPlan from "./DataPlan";
import Coverage from "./Coverage"
const Sidebar = ({ selectedEsim, onClose }) => {
  const [activeTab, setActiveTab] = useState("profile");

  if (!selectedEsim) return null;

  const getEsimStatusIcon = (status) => {
    switch (status) {
      case "canceled":
        return { icon: faTimes, color: "red", label: "Canceled" };
      case "got_resource":
        return { icon: faShoppingCart, color: "blue", label: "Resource Received" };
      case "new":
        return { icon: faPlusCircle, color: "green", label: "New" };
      case "in_use":
        return { icon: faSimCard, color: "green", label: "In Use" };
      default:
        return { icon: faChartBar, color: "gray", label: status || "Unknown" };
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50">
     
      <div className="bg-gray-900 opacity-50 absolute inset-0 cursor-pointer" onClick={onClose}></div>

      
      <div className="relative w-[52rem] bg-white shadow-2xl h-full p-6 rounded-l-2xl transform transition duration-300 translate-x-0">
      
        <div className="flex justify-between items-center border-b pb-4">
          {selectedEsim && (
            <div className="flex items-center">
              {(() => {
                const statusDetails = getEsimStatusIcon(selectedEsim.esimStatus);
                return (
                  <>
                    <FontAwesomeIcon icon={statusDetails.icon} style={{ color: statusDetails.color }} className="mr-2" />
                    <span>{statusDetails.label}</span>
                  </>
                );
              })()}
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800">eSIM Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 transition duration-300">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mt-4 border-b">
          {["profile", "dataPlan", "coverage", "action"].map((tab) => (
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

        {/* Content */}
        <div className="mt-4 space-y-4 overflow-y-auto max-h-screen pr-2">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="grid  grid-cols-2 gap-4">
                <p><strong>Order No:</strong> {selectedEsim.orderNo}</p>
                <p><strong>eSIM Status:</strong> {selectedEsim.esimStatus}</p>
                <p><strong>Package Name:</strong> {selectedEsim.packageList?.[0]?.packageName || "N/A"}</p>
                <p><strong>Data Volume Left:</strong> {selectedEsim.totalVolume ? `${(selectedEsim.totalVolume / 1024 / 1024).toFixed(2)} MB` : "N/A"}</p>
              </div>

              <div className="mt-4">
                <p className="mb-4">
                  <strong>Expired Time:</strong> {selectedEsim.expiredTime ? new Date(selectedEsim.expiredTime).toLocaleString() : "N/A"}
                </p>
                <p className="mb-2">
                  <strong>QR Code URL:</strong>{" "}
                  <a href={selectedEsim.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition duration-300">
                    View QR Code
                  </a>
                </p>
                <p>
                  <strong>Short URL:</strong>{" "}
                  <a href={selectedEsim.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition duration-300">
                    {selectedEsim.shortUrl || "N/A"}
                  </a>
                </p>
              </div>

              {selectedEsim.qrCodeUrl && (
                <div className="flex justify-center mt-4">
                  <img src={selectedEsim.qrCodeUrl} alt="QR Code" className="w-48 h-48 shadow-sm border-2 rounded-lg" />
                </div>
              )}
            </>
          )}

          {/* Data Plan Tab */}
          {activeTab === "dataPlan" && <DataPlan selectedEsim={selectedEsim} />}
        {activeTab=="coverage" && <Coverage selectedEsim = {selectedEsim} />}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
