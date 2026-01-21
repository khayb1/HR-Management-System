// src/services/leaveService.js
import { supabase } from "../supabase";

export const getTotalLeaveDays = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { data, error } = await supabase
    .from("leave_balances")
    .select("total_days")
    .eq("profile_id", user.id);

  if (error) {
    console.error(error);
    return 0;
  }

  return data.reduce((sum, item) => sum + item.total_days, 0);
};
