import { useEffect } from "react";
import { fetchProducts } from "../../features/products/productSlice";
import { useSelector, useDispatch } from "react-redux";

const Coverage = ({ selectedEsim }) => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.plans);

    const locationNetworkList = items[0]?.locationNetworkList || [];

    useEffect(() => {
        if (!selectedEsim?.packageList?.length) return;

        const payload = {
            iccid: selectedEsim.iccid,
            // locationCode: selectedEsim.packageList[0].locationCode.split(",")[0],
            slug: selectedEsim.packageList[0].slug,
            packageCode: selectedEsim.packageList[0].packageCode,
        };

        dispatch(fetchProducts(payload));
    }, [selectedEsim]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Coverage and Networks</h2>

            {locationNetworkList.length > 0 ? (
                locationNetworkList.map((network, index) => (
                    <div key={index} className="flex items-center justify-between  p-4 rounded-md shadow-sm">

                        <div className="flex items-center gap-3">
                            <img
                                src={`https://static.redteago.com${network.locationLogo}`}
                                alt={network.locationName || "Location Logo"}
                                className="w-8 h-8 rounded-full border"
                            />
                            <p className="text-lg font-medium text-gray-800">
                                {network.locationName}
                            </p>
                        </div>

                        {/* Right Section - Operators & Networks */}
                        <div className="text-right space-y-1">
                            {network.operatorList.map((operator, opIndex) => (
                                <div key={opIndex} className="flex items-center justify-end space-x-2">
                                    <span className="text-gray-900 font-medium">
                                        {operator.operatorName}
                                    </span>
                                    <span className="px-2 py-1 border rounded-md text-sm text-gray-700">
                                        {operator.networkType}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No network coverage available.</p>
            )}
        </div>
    );
};

export default Coverage;
