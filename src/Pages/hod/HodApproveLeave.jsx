import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { supabase } from "../../supabase";

const HodApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

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
        .select("id, role, department_id, full_name")
        .eq("id", user.id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.role !== "hod") {
        setError("Access denied. Only HODs can approve leave.");
        setLoading(false);
        return;
      }

      setProfile(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ================= FETCH DEPARTMENT PENDING LEAVES ================= */
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
            department_id
          ),
          leave_types (
            id,
            name
          )
        `,
        )
        .eq("status", "pending_hod") // only pending leaves
        .eq("employee.department_id", profile.department_id)
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
          status: "pending_admin",
          hod_approved_by: profile.id,
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
          hod_approved_by: profile.id, // optional: track who rejected
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
      <Header title="Approve Leave Requests" />

      <section className="p-4 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Pending Department Leave Requests
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
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Leave Type</th>
                    <th className="p-3 border">From</th>
                    <th className="p-3 border">To</th>
                    <th className="p-3 border">Days</th>
                    <th className="p-3 border">Reason</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="p-3 border">
                        {leave.employee?.full_name}
                      </td>
                      <td className="p-3 border">{leave.employee?.email}</td>
                      <td className="p-3 border">{leave.leave_types?.name}</td>
                      <td className="p-3 border">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border">{leave.total_days}</td>
                      <td className="p-3 border max-w-xs truncate">
                        {leave.reason}
                      </td>
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
                        </div>
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

export default HodApproveLeave;
