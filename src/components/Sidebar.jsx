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

  // Function to determine active link
  const isActive = (path) => location.pathname === path;

  // Dynamic role badge styling
  const roleBadgeClass = () => {
    switch (profile?.role) {
      case "admin":
        return "bg-red-500 text-white";
      case "hod":
        return "bg-green-400 text-white";
      default:
        return "bg-blue-300 text-black";
    }
  };

  return (
    <nav className="w-fit h-screen py-3 px-4 flex flex-col bg-gray-800 text-gray-200">
      {/* Top Section */}
      <div className="flex gap-5 justify-center items-center">
        <CalendarDays
          size={40}
          color="yellow"
          className="bg-black/80 rounded-xl p-2"
        />
        <p className="text-xl font-bold w-40">Origin8 Leave Management</p>
      </div>

      {/* Navigation Links */}
      <ul className="mt-6 gap-5 flex flex-col">
        <li
          className={`flex gap-4 items-center px-4 py-2 transition-all ${
            isActive("/dashboard")
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-100 hover:text-gray-800"
          }`}
        >
          <Home size={30} />
          <Link to="/dashboard" className="w-full">
            Dashboard
          </Link>
        </li>

        <li
          className={`flex gap-4 items-center px-4 py-2 transition-all ${
            isActive("/apply-leave")
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-100 hover:text-gray-800"
          }`}
        >
          <PlusCircle size={30} />
          <Link to="/apply-leave" className="w-full">
            Apply Leave
          </Link>
        </li>

        <li
          className={`flex gap-4 items-center px-4 py-2 transition-all ${
            isActive("/my-leaves")
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-100 hover:text-gray-800"
          }`}
        >
          <History size={30} />
          <Link to="/my-leaves" className="w-full">
            My Leaves
          </Link>
        </li>

        <li
          className={`flex gap-4 items-center px-4 py-2 transition-all ${
            isActive("/profile")
              ? "bg-amber-100 text-gray-800"
              : "hover:bg-amber-100 hover:text-gray-800"
          }`}
        >
          <UserRoundCogIcon size={30} />
          <Link to="/profile" className="w-full">
            Profile
          </Link>
        </li>

        {/* HOD Only */}
        {role === "hod" && (
          <li
            className={`flex gap-4 items-center px-4 py-2 transition-all ${
              isActive("/hod-approve-leaves")
                ? "bg-amber-100 text-gray-800"
                : "hover:bg-amber-100 hover:text-gray-800"
            }`}
          >
            <CircleCheckIcon size={30} />
            <Link to="/hod-approve-leaves" className="w-full">
              Approve Leaves
            </Link>
          </li>
        )}

        {/* Admin Only */}
        {role === "admin" && (
          <>
            <li
              className={`flex gap-4 items-center px-4 py-2 transition-all ${
                isActive("/manage-users")
                  ? "bg-amber-100 text-gray-800"
                  : "hover:bg-amber-100 hover:text-gray-800"
              }`}
            >
              <Users size={30} />
              <Link to="/manage-users" className="w-full">
                Manage Employees
              </Link>
            </li>

            <li
              className={`flex gap-4 items-center px-4 py-2 transition-all ${
                isActive("/hod-approve-leaves")
                  ? "bg-amber-100 text-gray-800"
                  : "hover:bg-amber-100 hover:text-gray-800"
              }`}
            >
              <CircleCheckIcon size={30} />
              <Link to="/admin-approve-leaves" className="w-full">
                Approve Leaves
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* User Info */}
      <div className="flex flex-col items-center mt-5">
        {/* Avatar */}
        <img
          src="https://origin8gh.com/storage/2025/05/kelvin-copy-819x1024.jpg"
          alt={`${profile?.full_name}'s avatar`}
          loading="lazy"
          className="h-20 w-20 rounded-full"
        />

        {/* Name, Email, Role, Logout */}
        <span className="flex flex-col items-center mt-3">
          <p className="font-bold text-xl">{profile?.full_name}</p>
          <p className="text-lg font-semibold">{user?.email}</p>
          <p className={`text-md px-2 py-1 rounded-xl ${roleBadgeClass()}`}>
            {profile?.role}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-3"
          >
            Logout
          </button>
        </span>
      </div>
    </nav>
  );
};

export default Sidebar;
