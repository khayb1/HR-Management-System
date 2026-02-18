import { supabase } from "../supabase";

export const getLeaveSummary = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { total: 0, used: 0, remaining: 0, pending: 0 };
  }

  // Get leave balance
  const { data: balance, error: balanceError } = await supabase
    .from("leave_balances")
    .select("total_entitled, remaining_days")
    .eq("user_id", user.id)
    .single();

  if (balanceError) {
    console.error(balanceError);
    return { total: 0, used: 0, remaining: 0, pending: 0 };
  }

  // Get pending leave requests
  const { data: pendingLeaves, error: pendingError } = await supabase
    .from("leave_requests")
    .select("id")
    .eq("user_id", user.id)
    .in("status", ["pending_admin", "pending_hod"]);

  if (pendingError) {
    console.error(pendingError);
  }

  const total = balance?.total_entitled ?? 0;
  const remaining = balance?.remaining_days ?? 0;
  const used = Math.max(total - remaining, 0);
  const pending = pendingLeaves?.length;
  console.log(pending);

  return { total, used, remaining, pending };
};
