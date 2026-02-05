import { supabase } from "../supabase";

export const getLeaveSummary = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { total: 0, used: 0, remaining: 0 };
  }

  // Get leave balance directly
  const { data, error } = await supabase
    .from("leave_balances")
    .select("total_entitled, remaining_days")
    .eq("user_id", user.id)
    .maybeSinglesingle(); // one row per user

  if (error) {
    console.error(error);
    return { total: 0, used: 0, remaining: 0 };
  }

  const total = data.total_days ?? 0;
  const remaining = data.remaining_days ?? 0;
  const used = Math.max(total - remaining, 0);

  return { total, used, remaining };
};
