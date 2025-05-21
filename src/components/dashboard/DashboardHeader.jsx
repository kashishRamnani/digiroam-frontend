import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faSignOutAlt,
  faWallet,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { signoutUser } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { resetCart, toggleModal } from "../../features";
import formatBalance from "../../utils/helpers/formateBalance";

const DashboardHeader = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);

  const logout = () => {
    dispatch(resetCart());
    dispatch(signoutUser());
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="flex items-center justify-between px-4 py-3">
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
          {user.accountType === 1 && (
            <Popover className="relative">
              <PopoverButton className="flex flex-col items-center focus:outline-none">
                <p className="text-lg font-semibold text-blue-600">${formatBalance(balance)}</p>
                <p className="text-sm text-gray-500 -mt-1">Wallet</p>
              </PopoverButton>

              {user.accountType === 1 && (
                <PopoverPanel className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-gray-500">
                    Current Balance:{" "}
                    <span className="font-semibold">
                      ${formatBalance(balance)}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    to="/wallet"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:font-semibold"
                  >
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                    Manage Wallet
                  </Link>
                  <Link
                    onClick={() => dispatch(toggleModal(true))}
                    to="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:font-semibold"
                  >
                    <FontAwesomeIcon icon={faWallet} className="mr-2" /> 
                    Top Up Now
                  </Link>
                </PopoverPanel>
              )}

            </Popover>
          )}

          {/* Profile */}
          <Popover className="relative">
            <PopoverButton className="flex items-center focus:outline-none">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {user?.name?.substring(0, 2).toUpperCase()}
              </div>
            </PopoverButton>

            <PopoverPanel className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-2 text-xs text-gray-500">
                Signed in as
                <br />
                <strong>{user?.email || user?.facebookId}</strong>
              </div>
              <div className="border-t border-gray-100 my-1" />
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:font-semibold"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                View Profile
              </Link>
              <Link
                to=""
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:font-semibold"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </Link>
            </PopoverPanel>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
