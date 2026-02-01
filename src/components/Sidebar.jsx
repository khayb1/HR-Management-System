import {
  CalendarDays,
  CircleCheckIcon,
  History,
  Home,
  PlusCircle,
  User,
  UserRoundCogIcon,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../utils/logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { profile, user, role } = useAuth();

  const [isactive, setIsActive] = useState();

  const navigate = useNavigate();

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="w-fit h-screen py-3 px-4 flex flex-col bg-gray-800 text-gray-200 ">
      {/* top section */}
      <div className="flex gap-5 justify-center items-center">
        <CalendarDays
          size={40}
          color="yellow"
          className="bg-black/80 rounded-xl p-2"
        />
        <p className="text-xl font-bold w-40">Origin8 Leave Management</p>
      </div>
      {/* nav links */}
      <ul className="mt-6 gap-5 flex flex-col ">
        <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
          <Home size={30} />
          <Link to="/dashboard" className="w-full">
            Dashboard
          </Link>
        </li>
        <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
          <PlusCircle size={30} />
          <Link to="/apply-leave" className="w-full">
            Apply Leave
          </Link>
        </li>
        <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
          <History size={30} />
          <Link to="/my-leaves" className="w-full">
            My Leaves
          </Link>
        </li>
        <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
          <UserRoundCogIcon size={30} />
          <Link to="/profile" className="w-full">
            Profile
          </Link>
        </li>
        {/* hod and admin only  */}
        {(role === "admin" || role === "hod") && (
          <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
            <CircleCheckIcon size={30} />
            <Link to="/approve-leaves" className="w-full">
              Approve Leaves
            </Link>
          </li>
        )}
        {/* only admin  */}

        {role === "admin" && (
          <li className="flex gap-4 items-center hover:bg-amber-100 px-4 py-2 transition-all hover:text-gray-800">
            <Users size={30} />
            <Link to="/manage-users" className="w-full">
              Manage Employees
            </Link>
          </li>
        )}
      </ul>
      {/* user info */}
      <div className="flex flex-col items-center mt-5">
        {/* avatar */}
        <img
          src="https://origin8gh.com/storage/2025/05/kelvin-copy-819x1024.jpg"
          loading="lazy"
          className=" h-20 w-20 rounded-full"
        />
        {/* name  */}
        <span className="flex flex-col items-center ">
          {/* name  */}
          <p className="font-bold text-xl">{profile?.full_name}</p>
          {/* email */}
          <p className="text-lg font-semibold">{user?.email}</p>
          <p className="text-md bg-blue-300 px-2 py-1 text-black rounded-xl">
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
