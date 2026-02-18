import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
  Calendar,
  LogOut,
  CheckCircle2Icon,
  Timer,
  FastForwardIcon,
} from "lucide-react";
import Header from "../../components/Header";
import { getLeaveSummary } from "../../services/leaveservices";

const HodDashboard = () => {
  const navigate = useNavigate();

  // leave summary remaining
  const [totalLeave, setTotalLeave] = useState(0);
  const [daysUsed, setUsed] = useState(0);
  const [daysRemaining, setRemaining] = useState(0);
  const [daysPending, setDaysPending] = useState(0);

  useEffect(() => {
    const loadLeave = async () => {
      const { total, used, remaining, pending } = await getLeaveSummary();
      setTotalLeave(total);
      setUsed(used);
      setRemaining(remaining);
      setDaysPending(pending);
    };

    loadLeave();
  }, []);

  return (
    <>
      <div>
        <Header title="Employee Dashbaord" />
      </div>
      <main className="p-4 px-6">
        <h1 className="text-2xl font-bold mb-4">Leave Overview</h1>
        {/* stats cards  */}
        <div className="flex gap-5 flex-wrap">
          {/* total leave days  card */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">{totalLeave}</p>
              <p>Total leave days</p>
            </div>
            <span className="p-2 bg-blue-500 rounded-xl">
              <Calendar size={40} color="white" />
            </span>
          </div>
          {/* days used  card*/}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">{daysUsed}</p>
              <p>Days Used</p>
            </div>
            <span className="p-2 bg-red-500 rounded-xl">
              <LogOut size={40} color="white" />
            </span>
          </div>
          {/* Days remaining  */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">{daysRemaining}</p>
              <p>Days Remaining</p>
            </div>
            <span className="p-2 bg-green-500 rounded-xl">
              <CheckCircle2Icon size={40} color="white" />
            </span>
          </div>
          {/* Pending Requests */}
          <div className="flex flex-1 justify-between items-center shadow-xl bg-gray-200 p-10 rounded-lg gap-5 hover:-translate-y-2 transition-transform">
            <div>
              <p className="text-3xl font-bold ">{daysPending}</p>
              <p>Pending Requests</p>
            </div>
            <span className="p-2 bg-orange-500 rounded-xl">
              <Timer size={40} color="white" />
            </span>
          </div>
        </div>
        {/* quick actions  */}
        <section className="flex flex-col mt-5 bg-gray-200 p-5 rounded-2xl shadow-xl">
          {/* top section  */}
          <div className="flex gap-5 ">
            <FastForwardIcon size={30} className="" />
            <p className="text-lg font-bold mb-5">Quick Actions</p>
          </div>
          {/* down section  */}
          <div className="flex gap-5  ">
            {/* apply for leave  */}
            <Link
              to="/apply-leave"
              className="flex w-56 justify-center items-center transition-all gap-3 px-4 py-3 border-none bg-amber-200 rounded-2xl hover:bg-amber-100 "
            >
              <CheckCircle2Icon size={30} />
              Apply For Leave
            </Link>
            {/* leave history  */}
            <Link
              to="/leave-history"
              className="flex w-56 justify-center  items-center transition-all gap-3 px-4 py-3 border-none bg-amber-200 rounded-2xl hover:bg-amber-100 "
            >
              <CheckCircle2Icon size={30} />
              Leave History
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HodDashboard;
