import { Outlet, NavLink } from "react-router-dom";

const Sidebar = () => (
  <div className="w-64 h-screen bg-secondary text-white p-5 fixed top-0 left-0">
    <h2 className="text-xl text-white font-bold mb-4">Admin Dashboard</h2>
    <nav className="space-y-2">
      <NavLink
        to="/admin-dashboard/email-template"
        className={({ isActive }) =>
      
          `block py-2 px-4  rounded transition duration-200 hover:bg-blue-700 text-white hover:text-white ${isActive ? "bg-blue-700" : ""}`
        }
      >
        Email Templates
      </NavLink>
      <NavLink
        to="/admin-dashboard/email-list"
        className={({ isActive }) =>
      
            `block py-2 px-4  rounded transition duration-200 hover:bg-blue-700 text-white hover:text-white ${isActive ? "bg-blue-700" : ""}`
          }
      >
        Email List
      </NavLink>
      <NavLink
        to="/admin-dashboard/send-email"
        className={({ isActive }) =>
      
            `block py-2 px-4  rounded transition duration-200 hover:bg-blue-700 text-white hover:text-white ${isActive ? "bg-blue-700" : ""}`
          }
      >
        Send Email
      </NavLink>
    </nav>
  </div>
);

const Header = () => (
  <div className="bg-white p-4 shadow-md fixed top-0 left-64 right-0 flex justify-between items-center h-16">
    <h2 className="text-xl font-bold">Admin Panel</h2>
    <p className="text-gray-700">Welcome, Admin</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <div className="p-6 mt-16 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />  {/* This will render child components */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
