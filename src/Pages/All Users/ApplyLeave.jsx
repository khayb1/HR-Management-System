import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { CheckCircle2, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

const ApplyLeave = () => {
  const { profile } = useAuth();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [durationType, setDurationType] = useState("full_day");
  const [hours, setHours] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");

  /* ---------------- FETCH LEAVE TYPES ---------------- */
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      const { data, error } = await supabase.from("leave_types").select("*");

      if (!error) setLeaveTypes(data);
    };

    fetchLeaveTypes();
  }, []);

  /* ---------------- CALCULATE TOTAL DAYS ---------------- */
  const calculateTotalDays = () => {
    if (durationType === "half_day") return 0.5;

    if (durationType === "hourly") {
      if (!hours || hours <= 0) return 0;
      return Number(hours) / 8;
    }

    const normalize = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const start = normalize(new Date(startDate));
    const end = normalize(new Date(endDate || startDate));

    if (end < start) {
      alert("End date cannot be before start date");
      return 0;
    }

    let days = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) days++;
    }

    return days;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalDays = calculateTotalDays();

    if (!leaveTypeId || !startDate || !reason || totalDays <= 0) {
      alert("Please complete the form correctly");
      return;
    }

    const { error } = await supabase.from("leave_requests").insert({
      user_id: profile.id,
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate || startDate,
      duration_type: durationType,
      hours: durationType === "hourly" ? hours : null,
      total_days: totalDays,
      reason,
    });

    if (error) {
      console.error(error);
      alert("Failed to submit leave request");
    } else {
      alert("Leave request submitted successfully");
      setLeaveTypeId("");
      setDurationType("full_day");
      setHours("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setContact("");
    }
  };

  const selectedLeave = leaveTypes.find((l) => l.id === leaveTypeId);

  return (
    <>
      <Header title="Apply For Leave" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 m-5 bg-gray-100 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-amber-400" />
          <h2 className="text-xl font-semibold">Leave Application</h2>
        </div>

        {/* LEAVE TYPE */}
        <div>
          <label>Leave Type</label>
          <select
            className="w-full p-3 rounded bg-amber-50"
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* DURATION */}
        {selectedLeave && (
          <div>
            <label>Duration</label>
            <select
              className="w-full p-3 rounded bg-amber-50"
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
            >
              {selectedLeave.allows_full_day && (
                <option value="full_day">Full Day</option>
              )}
              {selectedLeave.allows_half_day && (
                <option value="half_day">Half Day</option>
              )}
              {selectedLeave.allows_hourly && (
                <option value="hourly">Hourly</option>
              )}
            </select>
          </div>
        )}

        {/* HOURS */}
        {durationType === "hourly" && (
          <div>
            <label>Number of Hours</label>
            <input
              type="number"
              min="1"
              max="8"
              className="w-full p-3 rounded bg-amber-50"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </div>
        )}

        {/* DATES */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label>Start Date</label>
            <input
              type="date"
              className="w-full p-3 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
              min={new Date().toISOString().split("T")[0]}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label>End Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* REASON */}
        <div>
          <label>Reason</label>
          <textarea
            className="w-full p-3 rounded bg-amber-50"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        {/* contact  */}
        <div>
          <label>Contact</label>
          <textarea
            className="w-full p-3 rounded bg-amber-50"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        {/* EMPLOYEE */}
        <div>
          <label>Employee</label>
          <input
            readOnly
            value={profile?.full_name}
            className="w-full p-3 rounded bg-gray-200 "
          />
        </div>

        <button className="w-fit flex gap-3 hover:scale-105 transition-all  px-6 py-3 bg-amber-400 rounded">
          Submit Leave Request
          <Send size={25} className="" />
        </button>
      </form>
    </>
  );
};

export default ApplyLeave;
