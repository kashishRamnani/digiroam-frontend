import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";

const DataPlan = ({ selectedEsim }) => {
  const dispatch = useDispatch();
  const {
    totalDays,
    daysLeft,
    hoursLeft,
    minutesLeft,
    usagePercentage,
    totalData,
    dataLeft,
    dataUsagePercentage,
    error,
  } = useSelector((state) => state.dataPlan);

  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
    }
  }, [selectedEsim, dispatch]);

  if (error)
    return (
      <p className="text-red-500 text-center font-medium">Error: {error}</p>
    );

  return (
    <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Usage */}
        <div className="p-3 border rounded-md shadow-sm text-sm">
          <p className="text-base font-semibold text-gray-700 mb-2">
            Time Usage
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Total:</span> {totalDays} Days
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Left:</span>{" "}
            {totalDays
              ? `${totalDays} Days`
              : `${daysLeft}D ${hoursLeft}H ${minutesLeft}M`}
          </p>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {usagePercentage.toFixed(1)}%
          </p>
        </div>

        {/* Data Usage */}
        <div className="p-3 border rounded-md shadow-sm text-sm">
          <p className="text-base font-semibold text-gray-700 mb-2">
            Data Usage
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Total:</span> {totalData}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Left:</span> {dataLeft}
          </p>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${dataUsagePercentage.toFixed(1)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {dataUsagePercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* eSIM Package Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <p>
          <span className="text-gray-500">Package Name: </span>
          <span className="text-gray-900 font-semibold">
            {selectedEsim?.packageList[0].packageName ?? "N/A"}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Package Code: </span>
          <span className="text-gray-900 font-semibold">
            {selectedEsim?.packageList[0].packageCode ?? "N/A"}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Data: </span>
          <span className="text-gray-900 font-semibold">
            {selectedEsim
              ? getFormattedVolume(selectedEsim?.packageList[0].volume)
              : "N/A"}
          </span>
        </p>
        <p>
          <span className="text-gray-500">Duration: </span>
          <span className="text-gray-900 font-semibold">
            {selectedEsim
              ? `${selectedEsim.totalDuration} ${selectedEsim.durationUnit}`
              : "N/A"}
          </span>
        </p>
        <p className="md:col-span-2">
          <span className="text-gray-500">Top-up Type: </span>
          <span className="text-gray-900 font-semibold">
            Data is reloadable for the same area within the validity time.
          </span>
        </p>
      </div>
    </div>
  );
};

export default DataPlan;
