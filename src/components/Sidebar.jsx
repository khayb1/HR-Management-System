import { CalendarDays } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Sidebar = () => {
  return (
    <>
      <nav className="w-56 h-screen flex flex-col ">
        {/* top section  */}
        <div className="flex gap-5 justify-center items-center">
          <CalendarDays
            size={40}
            color="yellow"
            className="bg-black/80 rounded-xl p-2"
          />
          <p className="text-2xl font-bold w-40">Origin8's leave Management</p>
        </div>
        <ul>
          <li>
            <a></a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
