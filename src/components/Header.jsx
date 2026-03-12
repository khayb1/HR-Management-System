import React from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ title, pageName }) => {
  const { profile } = useAuth();

  //  date
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <nav className="flex sticky top-0 z-40 justify-between items-center px-10 py-5 bg-gray-100">
        <div>
          <p className="font-bold text-2xl">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{pageName}</p>
        </div>

        <div className="flex items-center gap-2 mr-5">
          <Calendar />
          <span>{today}</span>
        </div>
      </nav>
    </>
  );
};

export default Header;
