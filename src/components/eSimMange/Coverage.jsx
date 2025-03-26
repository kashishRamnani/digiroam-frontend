import { useEffect } from "react";
import { fetchProducts } from "../../features/products/productSlice";
import { useSelector, useDispatch } from "react-redux";

const Coverage = ({ selectedEsim }) => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.plans);

    const payload = {
        iccid: selectedEsim.iccid,
        locationCode: selectedEsim.packageList[0].locationCode,
        slug: selectedEsim.packageList[0].slug,
        packageCode: selectedEsim.packageList[0].packageCode,
    }

    useEffect(() => {
        dispatch(fetchProducts(payload));
    }, [selectedEsim]);

    console.log(items);
    return <h2>Coverage</h2>
    // return (
    // <div className="p-6 bg-gray-100 min-h-screen">
    //     <h2 className="text-2xl font-bold text-gray-800 mb-4">📡 Coverage Details</h2>

    //     {isLoading ? (
    //         <p className="text-gray-500">Loading coverage data...</p>
    //     ) : error ? (
    //         <p className="text-red-500">{error}</p>
    //     ) : filteredCoverage.length > 0 ? (
    //         filteredCoverage.map((pkg, index) => (
    //             <div key={index} className="bg-white shadow-lg rounded-lg p-5 mb-6 border">
    //                 <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>

    //                 {pkg.locationNetworkList?.map((network, idx) => (
    //                     <div key={idx} className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-500 rounded-md">
    //                         <h4 className="text-lg font-medium text-blue-600 flex items-center">
    //                             📍 {network.locationName}
    //                         </h4>

    //                         <ul className="mt-2 space-y-1">
    //                             {network.operatorList?.map((operator, opIndex) => (
    //                                 <li key={opIndex} className="text-gray-700 flex items-center">
    //                                     ✅ <span className="ml-2">{operator.operatorName} ({operator.networkType})</span>
    //                                 </li>
    //                             ))}
    //                         </ul>
    //                     </div>
    //                 ))}
    //             </div>
    //         ))
    //     ) : (
    //         <p className="text-gray-600">No coverage data available for this eSIM.</p>
    //     )}
    // </div>
    // );
};

export default Coverage;
