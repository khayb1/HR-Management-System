import {
  CalendarDays,
  CircleCheckIcon,
  History,
  Home,
  LogOut,
  PlusCircle,
  UserRoundCogIcon,
  Users,
} from "lucide-react";
// import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { profile, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Active link checker
  const isActive = (path) => location.pathname === path;

  // Dashboard route based on role
  const dashboardRoute =
    role === "admin"
      ? "/adminDashboard"
      : role === "hod"
        ? "/hodDashboard"
        : "/employeeDashboard";

  // Role badge styling
  const roleBadgeClass = () => {
    switch (role) {
      case "admin":
        return "bg-red-200/30 text-red-500 border-red-100";
      case "hod":
        return "bg-green-200/30 text-green-500 border-green-100";
      default:
        return "bg-blue-200/30 text-blue-500 border-blue-100";
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 h-screen w-fit bg-gray-800 text-gray-200
  transform transition-transform duration-300 z-50
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:static
  flex flex-col py-4 px-4`}
      >
        {/* Header */}
        <div className="flex gap-4 items-center ">
          <CalendarDays
            size={40}
            className="bg-black/80 text-yellow-400 rounded-xl p-2"
          />
          <p className="text-lg font-bold">Origin8 LMS</p>
        </div>

        {/* User Info */}
        <div className="mt-3 flex items-center gap-3 py-4 border-y-2 border-gray-700">
          <img
            src="https://origin8gh.com/storage/2025/05/kelvin-copy-819x1024.jpg"
            alt="User Avatar"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div className="flex flex-col ">
            <p className="mt-3 font-bold">{profile?.full_name}</p>
            <p className="text-xs font-extralight">{user?.email}</p>

            <span
              className={`mt-2 px-3 py-1 rounded-full w-fit text-sm   ${roleBadgeClass()}`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Links */}
        <ul className="mt-8 flex flex-col gap-2 pb-4 border-b-2 border-gray-700">
          {/* Dashboard */}
          <li
            className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
              isActive(dashboardRoute)
                ? "bg-amber-100 text-gray-800"
                : "hover:bg-amber-50 hover:text-gray-800"
            }`}
          >
            <Home size={24} />
            <Link
              to={dashboardRoute}
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </li>

          {/* Apply Leave */}
          <li
            className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
              isActive("/apply-leave")
                ? "bg-amber-100 text-gray-800"
                : "hover:bg-amber-50 hover:text-gray-800"
            }`}
          >
            <PlusCircle size={24} />
            <Link
              to="/apply-leave"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Apply Leave
            </Link>
          </li>

          {/* My Leaves */}
          <li
            className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
              isActive("/leave-history")
                ? "bg-amber-100 text-gray-800"
                : "hover:bg-amber-50 hover:text-gray-800"
            }`}
          >
            <History size={24} />
            <Link
              to="/leave-history"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Leave History
            </Link>
          </li>

          {/* Profile */}
          <li
            className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
              isActive("/profile")
                ? "bg-amber-100 text-gray-800"
                : "hover:bg-amber-50 hover:text-gray-800"
            }`}
          >
            <UserRoundCogIcon size={24} />
            <Link
              to="/profile"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </li>

          {/* HOD */}
          {role === "hod" && (
            <li
              className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
                isActive("/hod-approve-leaves")
                  ? "bg-amber-100 text-gray-800"
                  : "hover:bg-amber-50 hover:text-gray-800"
              }`}
            >
              <CircleCheckIcon size={24} />
              <Link
                to="/hod-approve-leaves"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Approve Leaves
              </Link>
            </li>
          )}

          {/* Admin */}
          {role === "admin" && (
            <>
              <li
                className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
                  isActive("/manage-users")
                    ? "bg-amber-100 text-gray-800"
                    : "hover:bg-amber-50 hover:text-gray-800"
                }`}
              >
                <Users size={24} />
                <Link
                  to="/manage-users"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Employees
                </Link>
              </li>

              <li
                className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
                  isActive("/admin-approve-leaves")
                    ? "bg-amber-100 text-gray-800"
                    : "hover:bg-amber-50 hover:text-gray-800"
                }`}
              >
                <CircleCheckIcon size={24} />
                <Link
                  to="/admin-approve-leaves"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Approve Leaves
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* logout button  */}
        <button
          onClick={handleLogout}
          className="mt-4 flex gap-3 justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          <LogOut />
          Logout
        </button>
      </nav>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
