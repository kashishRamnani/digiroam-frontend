import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEsims } from "../../features/user/allEsimSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Loader } from "../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faBan,faFileAlt,faClock,faMicrochip,faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Sidebar from "../../components/eSimMange/EsimDetails";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import { setCurrentPage } from "../../features";

const ESimManagement = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get("orderNo");

  const { currentPage, itemsPerPage } = useSelector((state) => state.plans);
  const { esims, isLoading } = useSelector((state) => state.esims);
  const [selectedEsim, setSelectedEsim] = useState(null);

  useEffect(() => {
    dispatch(fetchEsims({ orderNo }));
  }, [orderNo]);

  const handlePageChange = ({ selected }) => {
    dispatch(setCurrentPage(selected + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(esims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = esims.slice(startIndex, endIndex);

  const handleCopy = async (text) => {
    if (!text) return showErrorToast("QR Code not available.");
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Copied Successfully");
    } catch {
      showErrorToast("Failed to copy.");
    }
  };

  const handleOnClick = (esim) => {
    setSelectedEsim(esim);
  };


  const getEsimStatus = (status) => {
    switch (status) {
      case "CANCEL":
        return { icon: faBan, color: "red", label: "Deactivated" };
      case "GOT_RESOURCE":
        return { icon: faFileAlt, color: "purple", label: "Provisioned" };
      case "NEW":
        return { icon: faClock, color: "orange", label: "Awaiting Activation" };
      case "IN_USE":
        return { icon: faMicrochip, color: "teal", label: "Active on Device" };
      default:
        return { icon: faQuestionCircle, color: "gray", label: "Unknown State" };
    }
  };

  return (
    <DashboardLayout>
      {isLoading && <Loader />}
      <div className="container mx-auto px-6 py-8">
        <h3 className="text-3xl font-medium text-gray-700">Manage your eSIM Effectively!!</h3>

        <div className="mt-8 w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="px-4 py-3">Plan Name</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {Array.isArray(esims) && esims.length > 0 ? (
                  currentItems.map((esim, index) => {
                    const { icon, color, label } = getEsimStatus(esim.esimStatus);
                    return (
                      <tr key={index} className="text-gray-700">
                        <td className="px-4 py-3 text-sm flex items-center gap-2">
                          {esim.packageList?.[0]?.locationCode && (
                            <img
                              src={`https://flagcdn.com/w40/${esim.packageList[0].locationCode.split(",")[0].toLowerCase()}.png`}
                              alt={esim.packageList[0].locationCode}
                              className="w-8 h-8 rounded-full object-cover shadow-inner"
                            />
                          )}
                          <button
                            onClick={() => handleOnClick(esim)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            {esim.packageList?.[0]?.packageName || "N/A"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {esim.expiredTime ? new Date(esim.expiredTime).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span
                            className="px-2 py-1 font-semibold leading-tight rounded-full"
                            style={{ backgroundColor: color, color: "white" }}
                          >
                            <FontAwesomeIcon icon={icon} className="mr-2" />
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleCopy(esim.qrCodeUrl)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Copy QR Code"
                          >
                            <FontAwesomeIcon icon={faQrcode} className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-4 py-3">
                      No eSIMs found. Please try <span className="font-semibold">purchasing any!</span>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Sidebar selectedEsim={selectedEsim} onClose={() => setSelectedEsim(null)} />
        </div>
        {esims.length > 0 && (
          <div className="mt-4">
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage - 1}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ESimManagement;
