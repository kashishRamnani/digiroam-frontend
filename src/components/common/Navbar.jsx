import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../hooks";
import { setLanguage, resetCart } from "../../features";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { signoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preferences.language);

  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const menuItems = [
    { text: t("navbar.home"), href: "/" },
    { text: t("navbar.aboutus"), href: "/about-us" },
    { text: t("navbar.faq"), href: "/faqs" },
     { text: t("Blog's"), href: "https://blog.roamdigi.com/" },
    { text: t("navbar.login"), href: "/login" },
    { text: t("navbar.signup"), href: "/signup" },
  ];

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const logout = () => {
    dispatch(resetCart());
    dispatch(signoutUser());
  };

  return (
    <nav className="bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/">
            <img
              src="/images/roam-digi-logo.png"
              alt="Roamdigi Logo"
              className="w-32"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {menuItems
              .filter((item) =>
                isAuthenticated
                  ? item.href !== "/login" && item.href !== "/signup"
                  : true
              )
              .map((item) => (
                <Link
                  key={item.text}
                  to={item.href}
                  className="text-gray-800 hover:text-[#f67a55] transition-colors duration-200 text-sm font-medium"
                >
                  {item.text}
                </Link>
              ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="text-[#303030] bg-[#f67a55] hover:bg-[#FFFFFF] hover:text-[#f67a55] transition-colors duration-200 text-sm font-medium rounded px-2 py-1"
                >
                  {t("navbar.logout")}
                </button>
                <Link
                  to="/dashboard"
                  className="text-[#303030] bg-[#f67a55] hover:bg-[#FFFFFF] hover:text-[#f67a55] transition-colors duration-200 text-sm font-medium rounded px-2 py-1"
                >
                  {t("navbar.dashboard")}
                </Link>
              </>
            ) : null}
            {/* <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="rounded px-2 py-1 bg-gray-700 text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select> */}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden" ref={buttonRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#f67a55]"
            >
              {isOpen ? (
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden" ref={menuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems
              .filter((item) =>
                isAuthenticated
                  ? item.href !== "/login" && item.href !== "/signup"
                  : true
              )
              .map((item) => (
                <Link
                  key={item.text}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#303030] hover:text-[#f67a55] hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.text}
                </Link>
              ))}
            {isAuthenticated && (
              <div className="flex flex-col space-y-4">
                <button
                  onClick={logout}
                  className="text-[#303030] w-max bg-[#f67a55] hover:bg-[#FFFFFF] hover:text-[#f67a55] transition-colors duration-200 text-sm font-medium rounded px-2 py-1"
                >
                  {t("navbar.logout")}
                </button>
                <Link
                  to="/dashboard"
                  className="text-[#303030] w-max bg-[#f67a55] hover:bg-[#FFFFFF] hover:text-[#f67a55] transition-colors duration-200 text-sm font-medium rounded px-2 py-1"
                >
                  {t("navbar.dashboard")}
                </Link>
              </div>
            )}
            {/* <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="rounded px-2 py-1 bg-gray-700 text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
