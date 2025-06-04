import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { esimTypes, countryData } from "../../utils/data";
import { useTranslation } from "react-i18next";
import HomeProductListing from "../eSimPlans/HomeProductListing";
import { fetchProducts } from "../../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";

export default function ESimPlans() {
  const [activeTab, setActiveTab] = useState("local");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showProduct, setShowProduct] = useState(false);
  const { isLoading } = useSelector((state) => state.plans);
  const [ShowAllCountries, setShowCountries] = useState(false)
  
  const onSubmit = async (id) => {
    setShowCountries(false)
    if (id === "local") {
      setShowProduct(false);
      setActiveTab(id);
    } else if (id === "regional") {
      const result = await dispatch(fetchProducts({ locationCode: "!RG" }));
      if (fetchProducts.fulfilled.match(result)) {
        setShowProduct(true);
      }
      setActiveTab(id);
    } else if (id === "global") {
      const result = await dispatch(fetchProducts({ locationCode: "!GL" }));
      if (fetchProducts.fulfilled.match(result)) {
        setShowProduct(true);
      }
      setActiveTab(id);
    }
  };


  const showLocalListing = async (id) => {
    const result = await dispatch(fetchProducts({ locationCode: id }));
    if (fetchProducts.fulfilled.match(result)) {
      setShowProduct(true);
    }
  };
  const countriesToShow = ShowAllCountries
    ? countryData[activeTab] || []
    : (countryData[activeTab] || []).slice(0, 9)
  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      {isLoading && <Loader />}
      <div className="relative mb-12">
        <div className="flex justify-center items-center bg-gray-100 rounded-full border-solid border border-[#f67a55] p-1 max-w-md mx-auto">
          {esimTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onSubmit(type.id)}
              className={`flex-1 py-2 px-6 rounded-full text-sm font-medium transition-all
                ${activeTab === type.id
                  ? "bg-[#f67a55] text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {t("home.esimplan.title")}
        </h2>
      </div>

      {showProduct ? (
        <HomeProductListing />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {countriesToShow.map((country) => (
              <button
                key={country.id}
                onClick={() => showLocalListing(country.id)}
                className="flex items-center justify-between p-4 bg-white hover:border border-solid hover:border-[#f67a55] rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/${country.flag}.svg`}
                    alt={`${country.name} flag`}
                    className="w-8 h-6 object-cover rounded border border-solid border-[#f67a55]"
                  />
                  <span className="text-lg font-medium text-gray-800">
                    {country.name}
                  </span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-gray-400 w-4 h-4"
                />
              </button>
            ))}
          </div>

          {!ShowAllCountries && countryData[activeTab]?.length > 9 ? (
            <div className="text-center">
              <button
                className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setShowCountries(true)}
              >
                {t("home.esimplan.btnText")}
              </button>
            </div>
          ) : null}

        </>
      )}
    </div>
  );
}
