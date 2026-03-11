import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { supabase } from "../../supabase";
import { Eye, X } from "lucide-react";

const AdminApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);

  /* ================= FETCH LOGGED-IN USER PROFILE ================= */
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /* ================= FETCH LEAVES AFTER PROFILE LOAD ================= */
  useEffect(() => {
    if (profile) {
      fetchPendingLeaves();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profile")
        .select("id, role, full_name")
        .eq("id", user.id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.role !== "admin") {
        setError("Access denied. Only Admins can approve leave.");
        setLoading(false);
        return;
      }

      setProfile(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ================= FETCH HOD-APPROVED LEAVES ================= */
  const fetchPendingLeaves = async () => {
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
          employee:profile!leave_requests_user_id_fkey (
          id,
          full_name,
          email,
          department_id,
          department:departments!profile_department_id_fkey (
            id,
            name
          )
        ),
          leave_types (
            id,
            name
          )
        `,
        )
        .eq("status", "pending_admin") // Only leaves approved by HOD
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLeaves([]);
      } else {
        setLeaves(data || []);
      }
    } catch (err) {
      setError(err.message);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPROVE LEAVE ================= */
  const approveLeave = async (leaveId) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "approved", // final approved by Admin
          admin_approved_by: profile.id,
        })
        .eq("id", leaveId);

      if (error) {
        setError(error.message);
      } else {
        fetchPendingLeaves();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= REJECT LEAVE ================= */
  const rejectLeave = async (leaveId) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "rejected",
          admin_approved_by: profile.id,
        })
        .eq("id", leaveId);

      if (error) {
        setError(error.message);
      } else {
        fetchPendingLeaves();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Header title="Admin: Approve HOD-Approved Leave Requests" />

      <section className="p-4 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Pending HOD-Approved Leave Requests
          </h2>

          {loading ? (
            <p className="text-center py-8 text-gray-500">
              Loading leave requests...
            </p>
          ) : leaves.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No pending leave requests
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Employee</th>
                    <th className="p-3 border">Department</th>
                    <th className="p-3 border">Leave Type</th>
                    {/* <th className="p-3 border">From</th>
                    <th className="p-3 border">To</th> */}
                    <th className="p-3 border">Days</th>
                    {/* <th className="p-3 border">Reason</th> */}
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="p-3 border">
                        {leave.employee?.full_name}
                      </td>
                      <td className="p-3 border">
                        {leave.employee?.department?.name || "NA"}
                      </td>
                      <td className="p-3 border">
                        {leave.leave_types?.name || "NA"}
                      </td>
                      {/* <td className="p-3 border">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </td> */}
                      <td className="p-3 border">{leave.total_days}</td>
                      {/* <td className="p-3 border max-w-xs truncate">
                        {leave.reason}
                      </td> */}
                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveLeave(leave.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLeave(leave.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>

                          {/* detail button  */}
                          <button
                            onClick={() => setSelectedLeave(leave)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <Eye
                              size={30}
                              className="text-amber-500 hover:text-amber-300 hover:cursor-context-menu transition-all"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* pop out details  */}
          {selectedLeave && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/20 backdrop-blur-xs ">
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
                  {/* Employee Name  */}
                  <span className="flex items-center gap-3">
                    <p>Employee Name:</p>
                    {""}
                    <p className="font-light text-gray-500 ">
                      {" "}
                      {selectedLeave.employee?.full_name || "N/A"}
                    </p>
                  </span>

                  {/* department  */}
                  <span className="flex gap-3">
                    <p>Department:</p>
                    {""}
                    <p className="font-light text-gray-500">
                      {" "}
                      {selectedLeave.employee?.department?.name || "N/A"}
                    </p>
                  </span>

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
                      {new Date(selectedLeave.start_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </span>
                  {/* end date  */}
                  <span className="flex items-center gap-3">
                    <p>End Date:</p>
                    {""}
                    <p className="font-light text-gray-500 gap-3">
                      {new Date(selectedLeave.end_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
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

                  {/* applied on  */}
                  <span className="flex items-center gap-3">
                    <p>Applied on: </p>{" "}
                    <p className="font- text-gray-500">
                      {new Date(selectedLeave.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminApproveLeave;
