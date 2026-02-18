import {
  CalendarDays,
  CircleCheckIcon,
  History,
  Home,
  PlusCircle,
  UserRoundCogIcon,
  Users,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
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
        return "bg-red-500 text-white";
      case "hod":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-400 text-black";
    }
  };

  return (
    <nav className="w-72 h-screen overflow-y-auto py-4 px-4 flex flex-col bg-gray-800 text-gray-200">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <CalendarDays
          size={40}
          className="bg-black/80 text-yellow-400 rounded-xl p-2"
        />
        <p className="text-lg font-bold">Origin8 LMS</p>
      </div>

      {/* Links */}
      <ul className="mt-8 flex flex-col gap-2">
        {/* Dashboard */}
        <li
          className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
            isActive(dashboardRoute)
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-50 hover:text-gray-800"
          }`}
        >
          <Home size={24} />
          <Link to={dashboardRoute} className="w-full">
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
          <Link to="/apply-leave" className="w-full">
            Apply Leave
          </Link>
        </li>

        {/* My Leaves */}
        <li
          className={`flex gap-4 items-center px-4 py-2 rounded transition-all ${
            isActive("/my-leaves")
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-50 hover:text-gray-800"
          }`}
        >
          <History size={24} />
          <Link to="/my-leaves" className="w-full">
            My Leaves
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
          <Link to="/profile" className="w-full">
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
            <Link to="/hod-approve-leaves" className="w-full">
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
              <Link to="/manage-users" className="w-full">
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
              <Link to="/admin-approve-leaves" className="w-full">
                Approve Leaves
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* User Info */}
      <div className="mt-auto flex flex-col items-center pt-6 border-t border-gray-700">
        <img
          src="https://origin8gh.com/storage/2025/05/kelvin-copy-819x1024.jpg"
          alt="User Avatar"
          className="h-20 w-20 rounded-full object-cover"
        />

        <p className="mt-3 font-bold">{profile?.full_name}</p>
        <p className="text-sm">{user?.email}</p>

        <span
          className={`mt-2 px-3 py-1 rounded-full text-sm ${roleBadgeClass()}`}
        >
          {role}
        </span>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
