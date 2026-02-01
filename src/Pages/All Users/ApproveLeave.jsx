import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { supabase } from "../../supabase";

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch current user's profile first
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Fetch pending leaves when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchPendingLeaves();
    }
  }, [profile]);

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      // Fetch the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("id, role, department_id, full_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      // Check if user is HOD
      if (profileData.role !== "hod") {
        setError("Only HODs can approve leave requests");
        setLoading(false);
        return;
      }

      setProfile(profileData);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchPendingLeaves = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch pending leaves for HOD's department
      const { data, error } = await supabase
        .from("leave_requests")
        .select(
          `
          id,
          leave_type_id,
          start_date,
          end_date,
          total_days,
          reason,
          status,
          profile_id,
          department_id,
          profile:profile_id (
            id,
            full_name,
            email
          ),
          department:department_id (
            id,
            name
          ),
          leave_types:leave_type_id (
            id,
            name
          )
        `,
        )
        .eq("status", "PENDING_HOD")
        .eq("department_id", profile.department_id)
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

  // ✅ Approve leave (send to HR)
  const approveLeave = async (leaveId) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "PENDING_HR",
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

  // ❌ Reject leave
  const rejectLeave = async (leaveId) => {
    try {
      const { error } = await supabase
        .from("leave_requests")
        .update({
          status: "REJECTED",
          rejected_by: profile.id,
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

  return (
    <>
      <Header title="Approve Leave Requests" />

      <section className="p-4 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Pending Department Leave Requests
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading leave requests...</p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending leave requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 border border-gray-300">Employee</th>
                    <th className="p-3 border border-gray-300">Email</th>
                    <th className="p-3 border border-gray-300">Leave Type</th>
                    <th className="p-3 border border-gray-300">From</th>
                    <th className="p-3 border border-gray-300">To</th>
                    <th className="p-3 border border-gray-300">Days</th>
                    <th className="p-3 border border-gray-300">Reason</th>
                    <th className="p-3 border border-gray-300">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300">
                        {leave.profile?.full_name || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {leave.profile?.email || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {leave.leave_types?.name || "N/A"}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border border-gray-300">
                        {leave.total_days}
                      </td>
                      <td className="p-3 border border-gray-300 max-w-xs truncate">
                        {leave.reason || "No reason provided"}
                      </td>
                      <td className="p-3 border border-gray-300">
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveLeave(leave.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectLeave(leave.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
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

export default ApproveLeave;
