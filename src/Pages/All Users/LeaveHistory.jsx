import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { Eye, X } from "lucide-react";

const LeaveHistory = () => {
  const { profile } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [showPopUp, setShowPopUp] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchMyLeaves = async () => {
    if (!profile?.id) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(
          `
          id,
          start_date,
          end_date,
          total_days,
          reason,
          status,
          created_at,
          leave_types (
            id,
            name
          )
        `,
        )
        .eq("user_id", profile.id) // Only current user
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeaves(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch leave history");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [profile]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
      pending_hod: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Pending HOD",
      },
      pending_admin: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Pending Admin",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Header title="My Leaves" />

      <section className="p-4 w-full mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Leave History</h2>
            <div className="text-sm text-gray-600">
              Total Requests:{" "}
              <span className="font-semibold">{leaves.length}</span>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-500">
              Loading leave history...
            </p>
          ) : leaves.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-gray-600">No leave records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-5">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border text-left">Leave Type</th>
                    <th className="p-3 border text-left">Start Date</th>
                    <th className="p-3 border text-left">End Date</th>
                    <th className="p-3 border text-center">Days</th>
                    {/* <th className="p-3 border text-left">Reason</th> */}
                    <th className="p-3 border text-center">Status</th>
                    {/* <th className="p-3 border text-left">Applied On</th> */}
                    <th className="p-3 border text-left">Full Details</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="p-3 border font-medium">
                        {leave.leave_types?.name || "N/A"}
                      </td>
                      <td className="p-3 border">
                        {new Date(leave.start_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td className="p-3 border">
                        {new Date(leave.end_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-3 border text-center font-semibold">
                        {leave.total_days}
                      </td>
                      {/* Removed reason cos it makes the table too long  */}
                      {/* <td className="p-3 border max-w-xs">
                        <div className="truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td> */}
                      <td className="p-3 border text-center">
                        {getStatusBadge(leave.status)}
                      </td>
                      {/* removed because it makes the table too long  */}
                      {/* <td className="p-3 border text-gray-600 text-sm">
                        {new Date(leave.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td> */}
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => setSelectedLeave(leave)}
                          key={leave.id}
                          className=""
                        >
                          <Eye
                            size={30}
                            className="text-amber-500 hover:text-amber-300 hover:cursor-context-menu transition-all"
                          />
                        </button>

                        {/* pop up details  */}
                        {selectedLeave && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/20 backdrop-blur-xs ">
                            {/* pop up   */}
                            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
                              {/* header section  */}
                              <span className="flex justify-between items-center border-b pb-3 mb-4 ">
                                <p className="text-lg font-semibold text-gray-800">
                                  Leave Details
                                </p>
                                {/* close pop up button  */}
                                <button
                                  onClick={() => setSelectedLeave(null)}
                                  className="text-gray-400 hover:text-red-500 transition"
                                >
                                  <X
                                    color="red"
                                    size={30}
                                    className="p-1   border-none shadow-sm hover:bg-red-300 transition-all hover:cursor-pointer text-3xl"
                                  />
                                </button>
                              </span>
                              {/* Details  */}
                              <div className="flex flex-col">
                                {/* leave type  */}
                                <span className="flex items-center gap-3">
                                  <p>Leave Type:</p>
                                  {""}
                                  <p className="font-light text-gray-500 ">
                                    {" "}
                                    {selectedLeave.leave_types?.name || "N/A"}
                                  </p>
                                </span>
                                {/* start date  */}
                                <span className="flex items-center gap-3">
                                  <p>Start Date:</p>
                                  {""}
                                  <p className="font-light text-gray-500 ">
                                    {new Date(
                                      selectedLeave.start_date,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </span>
                                {/* end date  */}
                                <span className="flex items-center gap-3">
                                  <p>End Date:</p>
                                  {""}
                                  <p className="font-light text-gray-500 gap-3">
                                    {new Date(
                                      selectedLeave.end_date,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </span>
                                {/* number of days  */}
                                <span className="flex items-center gap-3">
                                  <p>Total Days:</p>
                                  {""}
                                  <p className="font-light text-gray-500">
                                    {" "}
                                    {selectedLeave.total_days}
                                  </p>
                                </span>
                                {/* reason  */}
                                <span className="flex gap-3">
                                  <p>Reason:</p>
                                  {""}
                                  <p className="font-light text-gray-500">
                                    {" "}
                                    {selectedLeave.reason}
                                  </p>
                                </span>
                                {/* status  */}
                                <span className="flex items-center gap-3">
                                  <p>Status:</p>
                                  {""}
                                  <p className="font-light text-gray-500">
                                    {" "}
                                    {getStatusBadge(selectedLeave.status)}
                                  </p>
                                </span>
                                {/* applied on  */}
                                <span className="flex items-center gap-3">
                                  <p>Applied on: </p>{" "}
                                  <p className="font- text-gray-500">
                                    {new Date(
                                      selectedLeave.created_at,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LeaveHistory;
