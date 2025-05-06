import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
const UserFilters = ({ paymentInfo = [], onfilter }) => {
    const [filterUser, setFilterUser] = useState("");
    const [selectedField, setSelectedField] = useState("all");

 const debouneced = useCallback(
        debounce((query, field)=>{
            applyFilter(query, field)
        },500),[paymentInfo]
    )

const handleChange = (e) => {
        const value = e.target.value;
        setFilterUser(value);
       debouneced(value, selectedField);
    };

const handleFieldChange = (e) => {
        const field = e.target.value;
        setSelectedField(field);
       debouneced(filterUser, field);
    };

const applyFilter = (query, field) => {
        if (!query.trim()) {
            onfilter(paymentInfo);
            return;
        }
        
        const lowerQuery = query.toLowerCase();

        const filtered = paymentInfo.filter((user) => {
            if (field === "all") {
                return (
                    user.name?.toLowerCase().includes(lowerQuery) ||
                    user.email?.toLowerCase().includes(lowerQuery) ||
                    String(user.totalPurchasedEsims).includes(lowerQuery) ||
                    String(user.totalPayments).includes(lowerQuery)
                );
            }

            switch (field) {
                case "name":
                    return user.name?.toLowerCase().includes(lowerQuery);
                case "email":
                    return user.email?.toLowerCase().includes(lowerQuery)
                case "totalEsims":
                    return String(user.totalPurchasedEsims || 0).includes(lowerQuery);
                case "totalPayment":
                    return String(user.totalPayments || 0).includes(lowerQuery);
                case "all":
                    return false;
            }
        });

        onfilter(filtered);
    };

    const clearFilter= () => {
        setFilterUser("")
        setSelectedField("all");
        onfilter(paymentInfo);
    };
    return (
        <div className="flex gap-3 items-center mb-5">
            <select
                value={selectedField}
                onChange={handleFieldChange}
                className="bg-white border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option className="bg-white" value="all">All</option>
                <option className="bg-white" value="name">Name</option>
                <option className="bg-white" value="email">Email</option>
                <option className="bg-white" value="totalEsims">Total eSIMs</option>
                <option className="bg-white" value="totalPayment">Total Payment</option>
            </select>

            <div className="relative w-full">
           <input
                type="text"
                placeholder= "Search Users..."
                value={filterUser}
                onChange={handleChange}
                className="bg-white w-full border px-3 py-2 pr-10 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {filterUser &&
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={clearFilter}
                    size="lg"
                />
            }
           </div>
        </div>
    );
};

export default UserFilters;
