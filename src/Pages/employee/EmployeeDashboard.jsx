import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, LogOut, Timer } from "lucide-react";
import { logout } from "../../utils/logout";
import { useAuth } from "../../context/AuthContext";
import { getTotalLeaveDays } from "../../services/leaveservices";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Proper date
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // leave days remaining
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const total = await getTotalLeaveDays();
      setTotalLeaveDays(total);
    };

    fetchData();
  }, []);
  return (
    <>
      <nav className="flex justify-between items-center px-10 py-5 bg-gray-100">
        <div>
          <p className="font-bold text-2xl">Employee Dashboard</p>
          <p className="text-sm text-gray-600">Welcome back {user?.email}</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar />
          <span>{today}</span>
        </div>
      </nav>

      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leave Overview</h1>
        {/* stats cards  */}
        <div className="flex gap-5 flex-wrap">
          {/* total leave days  card */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">{totalLeaveDays}</p>
              <p>Total leave days</p>
            </div>
            <span className="p-2 bg-blue-500 rounded-xl">
              <Calendar size={40} color="white" />
            </span>
          </div>
          {/* days used  card*/}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">22</p>
              <p>Days Used</p>
            </div>
            <span className="p-2 bg-yellow-500 rounded-xl">
              <LogOut size={40} color="white" />
            </span>
          </div>
          {/* Days remaining  */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">7</p>
              <p>Days Used</p>
            </div>
            <span className="p-2 bg-green-500 rounded-xl">
              <LogOut size={40} color="white" />
            </span>
          </div>
          {/* Pending Requests */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">2</p>
              <p>Days Used</p>
            </div>
            <span className="p-2 bg-red-500 rounded-xl">
              <Timer size={40} color="white" />
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </main>
    </>
  );
};

export default EmployeeDashboard;
