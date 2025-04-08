import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../features/products/productSlice";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, items } = useSelector((state) => state.plans);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      const locations = items.reduce((acc, { locationNetworkList }) => {
        locationNetworkList.forEach(({ locationCode, locationName }) => {
          if (!acc[locationCode]) {
            acc[locationCode] = locationName;
          }
        });
        return acc;
      }, {});

      setAvailableLocations(locations);
    }
  }, [dispatch, items]);

  useEffect(() => {
    if (query === "") {
      setFilteredLocations([]);
    } else {
      const filtered = Object.entries(availableLocations).filter(([code, name]) =>
        name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [query, availableLocations]);

  const handleSuggestionClick = (locationCode) => {
    navigate(`${locationCode}/plans`, { replace: true });
  };

  return (
    <section className="bg-white relative overflow-hidden pb-8">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/home/map-hero.png"
          alt="World Map Background"
          className="object-cover w-full h-full opacity-50"
        />
      </div>

      <div className="relative z-10 container flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-[#303030] text-3xl lg:text-5xl font-bold leading-tight lg:pt-6 pt-8">
              {t("home.heroSection.heading")}
              <br />
              <span className="text-[#f67a55]">{t("home.heroSection.highlight")}</span>{" "}
              <span className="text-[#303030]">{t("home.heroSection.subheading")}</span>
            </h1>
            <p className="text-[#303030] text-lg lg:text-xl max-w-2xl">
              {t("home.heroSection.description")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden border border-gray-100">
              <div className="pl-6">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#f67a55]" />
              </div>
              <input
                type="text"
                placeholder={t("home.heroSection.searchPlaceholder")}
                className="w-full px-4 py-4 text-gray-600 bg-white font-medium focus:outline-none"
                value={query}
                onChange={({ target }) => setQuery(target.value)}
              />
              <button className="bg-[#f67a55] py-4 px-8 rounded-full hover:bg-[#e56944] transition-colors">
                <FontAwesomeIcon icon={faSearch} className="text-white" />
              </button>

              {/* Suggestions */}
              {!!filteredLocations.length && query && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white shadow-lg rounded-lg">
                  <ul>
                    {filteredLocations.map(([code, name]) => (
                      <li
                        key={code}
                        className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-[#f67a55] hover:text-white"
                        onClick={() => handleSuggestionClick(code)}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Icon Section */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path
                  d="M24 4L30.24 16.71L44 18.29L34 28.02L36.48 44L24 36.48L11.52 44L14 28.02L4 18.29L17.76 16.71L24 4Z"
                  fill="#0049ac"
                />
                <path
                  d="M 24 4 L 30.24 16.71 L 44 18.29 L 34 28.02 C 27 30 22 28 20 22 L 18 17 V 16 Z"
                  fill="#f67a55"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[#303030] font-semibold text-xl">
                {t("home.heroSection.travelSmart")}
              </p>
              <p className="text-[#303030]">{t("home.heroSection.noBorders")}</p>
            </div>
          </div>
        </div>

        {/* Right Side Hero Image */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative max-w-2xl">
          <div className="relative w-full aspect-square md:max-h-96 lg:max-h-full">
            <div className="absolute right-0 top-0 w-full h-full">
              <div className="relative w-full h-full">
                <div className="absolute max-sm:right-8 sm:right-16 lg:right-0 top-0 w-4/5 h-full bg-[url('/images/auth/auth-bg.png')] bg-cover rounded-br-[70px]"></div>
                <img
                  src="/images/home/hero-person.png"
                  alt="Person using phone"
                  className="absolute right-20 mt-8 pt-0 sm:right-36 lg:right-28 bottom-[-20px] object-contain w-[76%] h-[83%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
