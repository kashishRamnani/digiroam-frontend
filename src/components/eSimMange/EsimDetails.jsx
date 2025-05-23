import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faShoppingCart,
  faPlusCircle,
  faSimCard,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import DataPlan from "./DataPlan";
import Coverage from "./Coverage";
import Action from "./Action";
import { formatBytesDetailed } from "../../utils/helpers/formatBytesDetailed";
import formateDateTime from "../../utils/helpers/formte.date.time";

const Sidebar = ({ selectedEsim, onClose, onCancelAndRefund }) => {
  const [activeTab, setActiveTab] = useState("profile");

  if (!selectedEsim) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-end z-50">
      <div
        className="bg-gray-900 opacity-50 absolute inset-0 cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="relative w-[52rem] bg-white shadow-2xl h-full p-6 rounded-l-2xl transform transition duration-300 translate-x-0 flex flex-col">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">eSIM Details</h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 transition duration-300"
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4 border-b">
          {["profile", "dataPlan", "coverage", "action"].map((tab) => {
            if (tab == "action" && selectedEsim.esimStatus == "CANCEL") {
              return null;
            }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium transition duration-300 ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] pr-4">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <p>
                  <span className="text-gray-500">Package Name: </span>
                  <span className="text-gray-900 font-semibold">
                    {selectedEsim.packageList?.[0]?.packageName || "N/A"}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Data Left: </span>
                  <span className="text-gray-900 font-semibold">
                    {formatBytesDetailed(
                      selectedEsim.totalVolume - selectedEsim.orderUsage,
                      !(selectedEsim.orderUsage > 0)
                    )}
                  </span>
                </p>
              </div>

              <div>
                <p className="mb-4">
                  <span className="text-gray-500">Expired Time: </span>
                  <span className="text-gray-900 font-semibold">
                    {formateDateTime(selectedEsim.expiredTime)}
                  </span>
                </p>
                <p className="mb-2">
                  <span className="text-gray-500">QR Code URL: </span>
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
                  <span className="text-gray-500">Short URL: </span>
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

          {/* Data Plan Tab */}
          {activeTab === "dataPlan" && <DataPlan selectedEsim={selectedEsim} />}

          {/* Coverage Tab */}
          {activeTab === "coverage" && <Coverage selectedEsim={selectedEsim} />}

          {/* Action Tab */}
          {activeTab === "action" && selectedEsim.esimStatus != "CANCEL" && (
            <Action onComplete={onCancelAndRefund} selectedEsim={selectedEsim} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
