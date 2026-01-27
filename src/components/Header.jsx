import React from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ header }) => {
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
      <nav className="flex justify-between items-center px-10 py-5 bg-gray-100">
        <div>
          <p className="font-bold text-2xl">{header}</p>
          <p className="text-sm text-gray-600">
            Welcome back {profile?.full_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar />
          <span>{today}</span>
        </div>
      </nav>
    </>
  );
};

export default Header;
