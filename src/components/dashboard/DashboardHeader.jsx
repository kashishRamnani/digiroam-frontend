import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signoutUser } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { resetCart } from "../../features";

const DashboardHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);

  const logout = () => {
    dispatch(resetCart());
    dispatch(signoutUser());
  };

  return (
    <header
      className="bg-white shadow-md"
      style={{ borderBottom: "2px solid var(--secondary-color)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 ">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
          <img
            src="/images/roam-digi-logo.png"
            alt="Roamdigi Logo"
            className="w-32 ml-3 mb-3 md:hidden"
          />
        </div>
        <div className="flex items-center space-x-4">

          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold text-blue-600">
              ${balance ? balance : '0.00'}
            </p>
            <p className="text-sm text-gray-500">Balance</p>
          </div>
          <div className="relative">
            <Popover className="relative">
              <PopoverButton className="flex items-center focus:outline-none">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {user?.name?.substring(0, 2).toUpperCase()}
                </div>
              </PopoverButton>

              <PopoverPanel className="absolute right-0 z-10 mt-2  rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-xs text-gray-500">
                  Signed in as
                  <br />
                  <strong>{user?.email || user?.facebookId}</strong>
                </div>
                <div className="border-t border-gray-100"></div>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  View Profile
                </Link>
                <Link
                  to=''
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </Link>
              </PopoverPanel>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
