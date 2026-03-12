import React from "react";
import Header from "../../components/Header";

import { Clock, FileCheckIcon, Hourglass, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardqueries";

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <>
      <Header title="Dashboard" />

      {/* stats cards  */}
      <div className="grid grid-col-2 md:grid-cols-2 gap-6 p-6">
        {/* total employees  */}
        <div className="flex flex-1 bg-blue-100 justify-between items-center shadow-xl p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
          <span>
            <p className="text-4xl font-bold">{data?.employees ?? 0}</p>
            <h3>Total Employees</h3>
          </span>
          <span className="p-2 bg-blue-500 rounded-xl">
            <Users size={40} color="white" />
          </span>
        </div>

        {/* hod pending leaves  */}
        <div className="bg-red-100 flex flex-1 justify-between items-center shadow-xl p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
          <span>
            <p className="text-3xl font-bold">{data?.hodPending ?? "N/A"}</p>
            <h3>HOD Pending Leaves</h3>
          </span>
          <span className="p-2 bg-red-500 rounded-xl">
            <Hourglass size={40} color="white" />
          </span>
        </div>

        {/* admin pending approval  */}
        <div className="bg-pink-100 flex flex-1 justify-between items-center shadow-xl p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
          <span>
            <p className="text-3xl font-bold">{data?.adminPending ?? "N/A"}</p>
            <h3>Admin Pending Leaves</h3>
          </span>
          <span className="p-2 bg-pink-500 rounded-xl">
            <Clock size={40} color="white" />
          </span>
        </div>

        {/*total approved leaves  */}
        <div className="bg-green-100 flex flex-1 justify-between items-center shadow-xl p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
          <span>
            <p className="text-3xl font-bold">
              {data?.totalApprovedLeaves ?? "N/A"}
            </p>
            <h3>Total Approved Leaves</h3>
          </span>
          <span className="p-2 bg-green-500 rounded-xl">
            <FileCheckIcon size={40} color="white" />
          </span>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
