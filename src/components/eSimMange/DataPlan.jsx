import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { fetchDataPlan } from "../../features/dataplan/dataPlanSlice";
import getFormattedVolume from "../../utils/helpers/get.formatted.volume";
import getPriceWithMarkup from "../../utils/helpers/get.price.with.markup";


const DataPlan = ({ selectedEsim }) => {
  const dispatch = useDispatch();
  const {
    totalDays,
    timeLeft,
    daysLeft,
    hoursLeft,
    minutesLeft,
    usagePercentage,
    totalData,
    dataLeft,
    dataUsagePercentage,
    error,
  } = useSelector((state) => state.dataPlan);
  const { pricePercentage } = useSelector((state) => state.settings);

  useEffect(() => {
    if (selectedEsim?.iccid) {
      dispatch(fetchDataPlan(selectedEsim.iccid));
      // dispatch(fetchDataPlan("8910300000023372752"));
    }
  }, [selectedEsim, dispatch]);

  if (error)
    return <p className="text-red-500 text-center font-medium">Error: {error}</p>;


  return (
    <div className="p-4 bg-white shadow-md rounded-md">


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Usage */}
        <div className="p-3 border rounded-md shadow-sm text-sm">
          <p className="text-base font-semibold text-gray-700">Time Usage</p>
          <p className="text-gray-600">
            <span className="font-medium">Total:</span> {totalDays} Days
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Left:</span>{" "}
            {totalDays ? `${totalDays} Days` : `${daysLeft}D ${hoursLeft}H ${minutesLeft}M`}
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
          <p className="text-base font-semibold text-gray-700">Data Usage</p>
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
      {/* eSIM Details */}

      {/* <div className="grid grid-cols-2 gap-4">
        <p>
          <strong>OrderNo:</strong> {selectedEsim?.orderNo || "N/A"}
        </p>
        <p>
          <strong>ICCID:</strong> {selectedEsim?.iccid || "N/A"}
        </p>
        <p>
          <span className="font-medium">Total amount:</span>{" "}
          {selectedEsim?.amount || "N/A"}
        </p>
        <p>
          <span className="font-medium">Billing starts:</span> First connection
        </p>
        <p>
          <span className="font-medium">Region type:</span>{" "}
          {selectedEsim?.regiontype || "N/A"}
        </p>
        <p>
          <span className="font-medium">Region:</span> {selectedEsim?.region || "N/A"}
        </p>
        <p>
          <span className="font-medium">Data type:</span> Fixed Data
        </p>
        <p>
          <span className="font-medium">Top up type:</span> Data Reloadable for same area within validity
        </p>
        <p>
          <span className="font-medium">IP Export:</span> UK/NO
        </p>
        <p>
          <span className="font-medium">APN:</span> {selectedEsim?.apn || "N/A"}
        </p>
      </div> */}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <p>Name: <strong>{selectedEsim?.packageList[0].packageName ?? "N/A"}</strong></p>
        <p>Code: <strong>{selectedEsim?.packageList[0].packageCode ?? "N/A"}</strong></p>
        <p>Data: <strong>{selectedEsim ? getFormattedVolume(selectedEsim?.packageList[0].volume) : "N/A"}</strong></p>
        <p>Duration: <strong>{selectedEsim ? `${selectedEsim.totalDuration} ${selectedEsim.durationUnit}` : "N/A"}</strong></p>
        {/* <p>Price: <strong>${selectedEsim ? getPriceWithMarkup(selectedEsim.price, pricePercentage) : "N/A"}</strong></p> */}
        {/* <p>Region Type: <strong>{selectedEsim ? selectedEsim?.location.split(',').length >= 2 ? "Multiple" : "Single" : "N/A"}</strong></p>
        <p>Region{selectedEsim?.location.split(',').length >= 2 && 's'}: <strong>{selectedEsim ? selectedEsim?.locationNetworkList?.map(loc => loc.locationName).join(", ") : "N/A"}</strong></p> */}
        {/* <p>Speed: <strong>{selectedEsim?.speed ?? "N/A"}</strong></p> */}
        <p>Top up type: <strong>{selectedEsim ? "Data is reloadable for the same area within the validity time." : "N/A"}</strong></p>
      </div>

    </div>
  );
};

export default DataPlan;
