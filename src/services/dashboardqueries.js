import { supabase } from "../supabase";

export const getDashboardStats = async () => {
  const [
    employeesQuery,
    hodPendingQuery,
    adminPendingQuery,
    approvedLeavesQuery,
  ] = await Promise.all([
    supabase.from("profile").select("*", { count: "exact", head: true }),

    supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_hod"),

    supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_admin"),

    supabase
      .from("leave_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  if (employeesQuery.error) throw new Error(employeesQuery.error.message);
  if (hodPendingQuery.error) throw new Error(hodPendingQuery.error.message);
  if (adminPendingQuery.error) throw new Error(adminPendingQuery.error.message);
  if (approvedLeavesQuery.error)
    throw new Error(approvedLeavesQuery.error.message);

  return {
    employees: employeesQuery.count,
    hodPending: hodPendingQuery.count,
    adminPending: adminPendingQuery.count,
    totalApprovedLeaves: approvedLeavesQuery.count,
  };
};
