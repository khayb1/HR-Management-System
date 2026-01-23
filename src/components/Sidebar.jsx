import { CalendarDays } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Sidebar = () => {
  return (
    <>
      <navbar className="w-56 h-screen flex flex-col ">
        {/* top section  */}
        <div className="flex gap-5 justify-center items-center">
          <CalendarDays
            size={40}
            color="gray"
            className="bg-amber-400 rounded-xl p-2"
          />
          <p className="text-2xl font-bold w-40">Origin8's leave Management</p>
        </div>
        <ul>
          <li>
            <Link to="" />
            Dashboard
          </li>
          <li>
            <Link to="" />
            Apply Leave
          </li>
          <li>
            <Link to="" />
            My Leaves
          </li>
          <li>
            <Link to="" />
            My Profile
          </li>
          <li>
            <Link to="" />
            Approve Leaves
          </li>
          <li>
            <Link to="" />
            Employees
          </li>
        </ul>
      </navbar>
    </>
  );
};

export default Sidebar;
