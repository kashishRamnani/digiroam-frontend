import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";

const DataPlan = ({ selectedEsim }) => {
  const dispatch = useDispatch();
  const {
    totalDays,
    daysLeft,
    usagePercentage,
    totalData,
    dataLeft,
    dataUsagePercentage,
    esimDetails,
    loading,
    error,
  } = useSelector((state) => state.dataPlan);

  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
    }
  }, [selectedEsim, dispatch]);

  return (
    <div className="mt-4 text-gray-700">
     
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Time Usage */}
            <div>
              <p className="font-medium">Total time: <span className="font-normal">{totalDays} Days</span></p>
              <div className="flex items-center gap-2">
                <p className="font-medium">Time left: <span className="font-normal">{daysLeft} Days</span></p>
                <div className="w-32 h-3 bg-blue-200 rounded-full">
                  <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                </div>
                <span className="text-xs text-blue-500">{usagePercentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Data Usage */}
            <div>
              <p className="font-medium">Total data: <span className="font-normal">{(totalData || 0).toFixed(2)} GB</span></p>
              <div className="flex items-center gap-2">
                <p className="font-medium">Data left: <span className="font-normal">{(dataLeft || 0).toFixed(2)} GB</span></p>
                <div className="w-32 h-3 bg-blue-200 rounded-full">
                  <div className="h-3 bg-blue-500 rounded-full" style={{ width: `${dataUsagePercentage}%` }}></div>
                </div>
                <span className="text-xs text-blue-500">{dataUsagePercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* eSIM Details */}
          <div className="grid grid-cols-2 gap-4">
            <p><strong>OrderNo:</strong> {esimDetails?.orderNo || "N/A"}</p>
            <p><strong>ICCID:</strong> {esimDetails?.iccid || "N/A"}</p>
            <p><strong>Total amount:</strong> {esimDetails?.amount || "N/A"}</p>
            <p><strong>Billing starts:</strong> First connection</p>
            <p><strong>Region type:</strong> {esimDetails?.regiontype || "N/A"}</p>
            <p><strong>Region:</strong> {esimDetails?.region || "N/A"}</p>
            <p><strong>Data type:</strong> Fixed Data</p>
            <p><strong>Top up type:</strong> Data Reloadable for same area within validity</p>
            <p><strong>Breakout IP:</strong> UK/NO</p>
            <p><strong>APN:</strong> {esimDetails?.apn || "N/A"}</p>
          </div>

          <h3 className="mt-6 font-semibold text-lg text-gray-800">Basic Plan</h3>
        </>
      )}
    </div>
  );
};

export default DataPlan;
