import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { formatBytesDetailed } from "../../utils/helpers/formatBytesDetailed";
import { convertMillisecondsToDHMS } from "../../utils/helpers/convertMillisecondsToDHMS";

const DataPlan = ({ selectedEsim }) => {
  const [totalDays, setTotalDays] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [usagePercentage, setUsagePercentage] = useState(100);
  const [totalData, setTotalData] = useState("0B");
  const [dataLeft, setDataLeft] = useState("0B");
  const [dataUsagePercentage, setDataUsagePercentage] = useState(100);

  useEffect(() => {
    if (!selectedEsim?.iccid) return;

    const fetchDataPlan = async () => {
      try {
        const response = await axiosInstance.post("/esim/allocatedProfiles", {
          iccid: selectedEsim.iccid,
          pager: { pageNum: 1, pageSize: 10 },
        });

        if (response.data?.success) {
          const esimData = response.data.data?.esimList?.[0] || null;

          // Time calculation
          if (esimData?.expiredTime) {
            const currentDate = new Date();
            const expiredDate = new Date(esimData.expiredTime);
            const activateDate = esimData?.activateTime ? new Date(esimData.activateTime) : null;
            const totalPlanDays = esimData.totalDuration ?? 0;
            setTotalDays(totalPlanDays);

            let remainingTime = 0;
            if (activateDate) {
              // Calculate plan expiry based on activation and total duration
              const totalPlanTimeMs = totalPlanDays * 24 * 60 * 60 * 1000;
              const planExpiryDate = new Date(activateDate.getTime() + totalPlanTimeMs);
              remainingTime = Math.max(0, planExpiryDate - currentDate);
              setUsagePercentage((remainingTime / totalPlanTimeMs) * 100);
            } else if (currentDate < expiredDate) {
              // If not activated, use the expiredTime value directly
              remainingTime = Math.max(0, expiredDate - currentDate);
              setUsagePercentage(100);
            } else {
              remainingTime = 0;
              setUsagePercentage(0);
            }

            const { days, hours, minutes } = convertMillisecondsToDHMS(remainingTime);
            setDaysLeft(days);
            setHoursLeft(hours);
            setMinutesLeft(minutes);
          }

          // Data calculation
          if (esimData?.totalVolume) {
            const totalVolume = esimData.totalVolume; // Total data in bytes
            const usedVolume = esimData.orderUsage || 0; // Used data in bytes
            const remainingVolume = totalVolume - usedVolume;

            setTotalData(formatBytesDetailed(totalVolume));
            setDataLeft(formatBytesDetailed(remainingVolume, !usedVolume > 0));
            setDataUsagePercentage((remainingVolume / totalVolume) * 100);
          }
        }
      } catch (error) {
        console.error("Error fetching data plan:", error);
      }
    };

    fetchDataPlan();
  }, [selectedEsim]);

  return (
    <div className="mt-4 text-gray-700">
      <div className="grid grid-cols-2 gap-4">
        {/* Time Usage */}
        <div>
          <p className="font-medium">
            Total time: <span className="font-normal">{totalDays} Days</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              Time left:{" "}
              <span className="font-normal">
                {daysLeft} Days {hoursLeft} Hours {minutesLeft} Minutes
              </span>
            </p>
            <div className="w-32 h-3 bg-blue-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-500">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Data Usage */}
        <div>
          <p className="font-medium">
            Total data: <span className="font-normal">{totalData}</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              Data left: <span className="font-normal">{dataLeft}</span>
            </p>
            <div className="w-32 h-3 bg-blue-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{ width: `${dataUsagePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-500">
              {dataUsagePercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* eSIM Details */}
      <div className="grid grid-cols-2 gap-4">
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
          <span className="font-medium">Breakout IP:</span> UK/NO
        </p>
        <p>
          <span className="font-medium">APN:</span> {selectedEsim?.apn || "N/A"}
        </p>
      </div>

      <h3 className="mt-6 font-semibold text-lg text-gray-800">Basic Plan</h3>
    </div>
  );
};

export default DataPlan;
