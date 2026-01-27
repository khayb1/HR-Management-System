import React, { useState } from "react";
import Header from "../../components/Header";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");

  const { profile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leaveType || !startDate || !endDate || !reason) {
      alert("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("leaves").insert({
      employee_id: profile.id,
      //   employee_name: profile.full_name,
      department: profile.department,
      //   role: profile.role,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
      contact_info: contact,
      status: "pending",
    });

    if (error) {
      console.error(error);
      alert("Failed to submit leave request");
    } else {
      alert("Leave request submitted successfully");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setContact("");
    }
  };

  return (
    <>
      <Header header="Apply For Leave" />
      {/* leave form  */}
      <form
        onSubmit={handleSubmit}
        className="flex overflow-x-hidden flex-col gap-7 m-5 bg-gray-200 rounded-2xl shadow-2xs p-5"
      >
        <div className="flex w-full gap-5">
          <CheckCircle2 size={30} className="text-amber-300" />
          <p className="font-semibold text-xl">Apply for Leave</p>
        </div>
        <p className="font-light">
          Fill out the form below to submit a leave request.
        </p>
        {/* leave type  */}
        <div className="flex gap-5">
          <span>
            <label>Leave Type</label>
            <select
              value={leaveType}
              required
              onChange={(e) => setLeaveType(e.target.value)}
              className="flex  flex-1  justify-between p-3 border rounded-2xl bg-amber-50 active:border-amber-50"
            >
              <option value="">Select Leave Type</option>
              <option value="Full Day"> Annual (Full Day)</option>
              <option value="Half Day"> Annual (Half Day)</option>
              <option value="Hour Leave">Annual (Hour Leave)</option>
              <option value="Excuse Duty"> Excuse Duty/ Sick Leave</option>
              <option value="Compassionate leave"> Compassionate Leave</option>
              <option value="Martenity Leave"> Martenity Leave</option>
            </select>
          </span>
          {/* employee  */}
          <span className="flex  flex-col">
            <label>Employee</label>
            <input
              className="p-3 bg-amber-50 rounded-2xl cursor-wait opacity-70"
              value={profile?.full_name}
              type="text"
              readOnly
              placeholder={profile?.full_name}
            />
          </span>
        </div>
        {/* leave date  */}
        <div className="flex gap-5">
          <span className="flex flex-col">
            {/* start date  */}
            <label>Start Date</label>
            <input
              type="date"
              className="w-full flex-1 flex border-gray-50 border p-3 rounded"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              required
            />
          </span>
          {/* end date  */}
          <span className="flex flex-col">
            <label>End Date</label>
            <input
              type="date"
              placeholder="1-Jan-2022"
              className="w-full flex-1 flex border-gray-50 border p-3 rounded"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              required
            />
          </span>
        </div>

        {/* reason  */}
        <div>
          <p>Reason For Leave</p>
          <input
            value={reason}
            type="text"
            className="p-4  bg-amber-50"
            placeholder="Please provide details about your leaver equest..."
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        {/* Contact During Leave  */}
        <div>
          <p>Contact Info During Leave</p>
          <input
            value={contact}
            type="number"
            className="p-4 bg-amber-50 "
            placeholder="Phone number where you can be reached"
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-fit p-4 border">
          Submit
        </button>
      </form>
    </>
  );
};

export default ApplyLeave;
