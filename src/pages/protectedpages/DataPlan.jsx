import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

const DataPlan = ({ selectedEsim }) => {
  const [dataPlan, setDataPlan] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [usagePercentage, setUsagePercentage] = useState(100);

  useEffect(() => {
    if (!selectedEsim?.orderNo) return;

    const fetchDataPlan = async () => {
      try {
        const response = await axiosInstance.post("/esim/allocatedProfiles", {
          orderNo: selectedEsim.orderNo,
          pager: { pageNum: 1, pageSize: 10 },
        });
        console.log("API Response:", response.data);
        if (response.data?.success) {
          const esimData = response.data.data?.esimList?.[0] || null;
          console.log('startTime:', esimData?.startTime, 'endTime:', esimData?.endTime);
          setDataPlan(esimData);

          
          if (esimData?.startTime && esimData?.endTime) {
            const startDate = new Date(esimData.startTime);
            const endDate = new Date(esimData.endTime);
            const currentDate = new Date();

            const total = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))); 
            const left = Math.max(0, Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24))); 

            setTotalDays(total);
            setDaysLeft(left);
            setUsagePercentage((left / total) * 100);
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
              Time left: <span className="font-normal">{daysLeft} Days</span>
            </p>
            <div className="w-32 h-3 bg-blue-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-blue-500">{usagePercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Data Usage */}
        <div>
          <p className="font-medium">
            Total data: <span className="font-normal">{dataPlan?.totalData || "N/A"}</span>
          </p>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              Data left: <span className="font-normal">{dataPlan?.dataLeft || "N/A"}</span>
            </p>
            <div className="w-32 h-3 bg-blue-200 rounded-full">
              <div
                className="h-3 bg-blue-500 rounded-full"
                style={{
                  width: `${
                    dataPlan?.totalData && dataPlan?.dataLeft
                      ? (dataPlan.dataLeft / dataPlan.totalData) * 100
                      : 100
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-xs text-blue-500">
              {(
                (dataPlan?.dataLeft / dataPlan?.totalData) *
                100 || 100
              ).toFixed(1)}
              %
            </span>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Other Details */}
      <div className="grid grid-cols-2 gap-4">
        <p><strong>OrderNo:</strong>{selectedEsim.orderNo}</p>
        <p><strong>ICCID:</strong> {selectedEsim.iccid}</p>
        <p>
          <span className="font-medium">Total amount:</span> {selectedEsim?.amount || "N/A"}
        </p>
        <p>
          <span className="font-medium">Billing starts:</span> First connection
        </p>
        <p>
          <span className="font-medium">Region type:</span> {selectedEsim.regiontype}
        </p>
        <p>
          <span className="font-medium">Region:</span> {selectedEsim.region}
        </p>
        <p>
          <span className="font-medium">Data type:</span> Fixed Data
        </p>
        <p>
          <span className="font-medium">Top up type:</span> Data Reloadable for
          same area within validity
        </p>
        <p>
          <span className="font-medium">Breakout IP:</span> HK
        </p>
        <p>
          <span className="font-medium">APN:</span> cmhk
        </p>
      </div>

      <h3 className="mt-6 font-semibold text-lg text-gray-800">Basic Plan</h3>
    </div>
  );
};

export default DataPlan;
