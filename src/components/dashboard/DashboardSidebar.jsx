import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCog,
  faSignOutAlt,
  faTimes,
  faListCheck,
  faSimCard,
  faClipboardList ,
  faEnvelopeOpenText,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signoutUser } from "../../features/auth/authSlice";
import { resetCart } from "../../features";
import { useAuth } from "../../hooks/useAuth";

const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  let menuItems;

  if (user.accountType == 2) {
    menuItems = [
      {
        icon: faHome,
        text: "Dashboard",
        href: "/dashboard"
      },
      // {
      //   icon: faEnvelopeOpenText,
      //   text: "Email Templates",
      //   href: "/email-templates",
      // },
      {
        icon:  faClipboardList ,
        text: "Email List",
        href: "/email-list",
      },
      // {
      //   icon:faEnvelope,
      //   text: "Send Email",
      //   href: "/send-email",
      // },
      {
        icon: faCog,
        text: "Profile Settings",
        href: "/profile"
      },
    ];
  } else {
    menuItems = [
      {
        icon: faHome,
        text: "Dashboard",
        href: "/dashboard"
      },
      {
        icon: faSimCard,
        text: "eSim Plans",
        href: "/eSim-plans",
      },
      {
        icon: faListCheck,
        text: "Manage User's eSim",
        href: "/manage-user-profiles",
      },
      {
        icon: faCog,
        text: "Profile Settings",
        href: "/profile"
      },
    ];
  }

  const logout = () => {
    dispatch(resetCart());
    dispatch(signoutUser());
  };

  return (
    <div
      className={`text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}
      style={{ backgroundColor: "var(--secondary-color)" }}
    >
      <div className="flex items-center justify-between px-4">
        <img
          src="/images/roam-digi-logo-white.png"
          alt="Roamdigi Logo"
          className="w-32"
        />
        <button onClick={toggleSidebar} className="md:hidden">
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 text-white hover:text-white"
          >
            <FontAwesomeIcon icon={item.icon} className="mr-3" />
            {item.text}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={logout}
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 text-white hover:text-white"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
