

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetCheckIn } from "@/features/Slice/CheckInSlice";
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { setCheckOut } from "@/features/Slice/CheckOutSlice";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const CheckOut = () => {
  const [noteModal, setNoteModal] = useState(false);
  const [workModal, setWorkModal] = useState(false);
  const [loadingsubmit, setLoadingsubmit] = useState(false);
  const [note, setNote] = useState("");
  const { isCheckedIn, attendenceid } = useSelector((state) => state.Checkin);
  const { isCheckedOut } = useSelector((state) => state.Checkout);
  const { user } = useSelector((state) => state.User);
  const { isRunning, elapsedTime, startTime } = useSelector(
    (state) => state.Stopwatch
  );
  const dispatch = useDispatch();
  const [canCheckOut, setCanCheckOut] = useState(false);

  // 🔹 Sales form fields
  const [workData, setWorkData] = useState({
    totalCalls: "",
    followUps: "",
    followUpNames: "",
    newLeads: "",
    salesClosed: "",
    meetings: "",
    notes: "",
    satisfaction: "",
  });

  // 🔹 Convert ISO time to 12-hour format
  const isoTo12Hour = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const modifier = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${hours}:${minutes} ${modifier}`;
  };

  // 🔹 Get current IP address
  const getcurrentip = async () => {
    const res = await fetch("https://api.ipify.org?format=json");
    const { ip } = await res.json();
    return ip;
  };

  // 🔹 Format stopwatch seconds to HH:MM:SS
  const formatElapsedTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

 
  useEffect(() => {
    if (!user?.department?.checkOutTime) return;
    const checkOutStr = user.department.checkOutTime;
    const officeCheckOut = new Date();
    const is12Hour =
      checkOutStr.toLowerCase().includes("am") ||
      checkOutStr.toLowerCase().includes("pm");

    let hours, minutes;
    if (is12Hour) {
      const [time, meridiem] = checkOutStr.split(" ");
      const [h, m] = time.split(":");
      hours = parseInt(h);
      minutes = parseInt(m);
      if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
    } else {
      [hours, minutes] = checkOutStr.split(":").map(Number);
    }

    officeCheckOut.setHours(hours, minutes, 0, 0);

    const enableTime = new Date(officeCheckOut.getTime() - 30 * 60000);
    const disableTime = new Date(officeCheckOut.getTime() + 30 * 60000);
    const now = new Date();

    setCanCheckOut(now >= enableTime && now <= disableTime);
  }, [user]);

  // 🔹 Handle successful checkout
  const handleCheckoutSuccess = (time) => {
    toast.success("Checked out successfully!");
    dispatch(resetTimer());
    dispatch(resetCheckIn());
    dispatch(setCheckOut(time));
    setLoadingsubmit(false);
    setNoteModal(false);
    setWorkModal(false);
  };

  // 🔹 Normal checkout request
  const normalcheckout = async () => {
    try {
      setLoadingsubmit(true);
      const ip = await getcurrentip();
      const now = new Date();
      const time = isoTo12Hour(now.toISOString());
      const totalElapsedSeconds = isRunning
        ? elapsedTime + Math.floor((Date.now() - startTime) / 1000)
        : elapsedTime;
      const formattedStopwatchTime = formatElapsedTime(totalElapsedSeconds);

      const res = await axios.post("/api/check-out", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: null,
        stopwatchTime: formattedStopwatchTime,
        attendenceid,
      });

      if (res.data?.success) {
        handleCheckoutSuccess(time);
      } else {
        toast.error(res.data?.message || "Something went wrong!");
        setLoadingsubmit(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Server error");
      setLoadingsubmit(false);
    }
  };


  const latecheckout = async () => {
    try {
      setLoadingsubmit(true);
      const ip = await getcurrentip();
      const now = new Date();
      const time = isoTo12Hour(now.toISOString());
      const totalElapsedSeconds = isRunning
        ? elapsedTime + Math.floor((Date.now() - startTime) / 1000)
        : elapsedTime;
      const formattedStopwatchTime = formatElapsedTime(totalElapsedSeconds);

      const res = await axios.post("/api/check-out", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: note || "",
        stopwatchTime: formattedStopwatchTime,
        attendenceid,
      });

      if (res.data?.success) {
        handleCheckoutSuccess(time);
      } else {
        toast.error(res.data?.message || "Something went wrong!");
        setLoadingsubmit(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Server error");
      setLoadingsubmit(false);
    }
  };


  const submitWorkSummary = async () => {
    try {
      setLoadingsubmit(true);
      const ip = await getcurrentip();
      const now = new Date();
      const time = isoTo12Hour(now.toISOString());
      const totalElapsedSeconds = isRunning
        ? elapsedTime + Math.floor((Date.now() - startTime) / 1000)
        : elapsedTime;
      const formattedStopwatchTime = formatElapsedTime(totalElapsedSeconds);

      const res = await axios.post("/api/check-out", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: JSON.stringify(workData),
        stopwatchTime: formattedStopwatchTime,
        attendenceid
      });

      if (res.data?.success){ 
        const res = await axios.post("/api/summary-work" , {
          ...workData,
           employeeId: user?.employeeId,
        })
        if(res.data?.success){
          handleCheckoutSuccess(time);
        }
        
      }
      else {
        toast.error(res.data?.message || "Something went wrong!");
        setLoadingsubmit(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Server error");
      setLoadingsubmit(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

      <button
        disabled={!isCheckedIn || isCheckedOut}
        onClick={() => {
          if (user?.department?.departmentName === "Sales") {
            setWorkModal(true);
          } else {
            normalcheckout();
          } 
        }}
        className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isCheckedIn && !isCheckedOut
            ? "bg-[#5965AB] hover:bg-[#5766bc]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <CheckCircle size={80} color="white" />
      </button>

      {/* 🔹 Secondary Button */}
      {!canCheckOut && (
        <div className="mt-8 w-full flex justify-center">
          <button
            onClick={() => {
              if (user?.department?.departmentName === "Sales") {
                setWorkModal(true);
              } else {
                setNoteModal(true);
              }
            }}
            disabled={!isCheckedIn || isCheckedOut}
            className={`px-6 py-3 rounded-lg font-medium shadow transition-all duration-300 ${
              isCheckedIn && !isCheckedOut
                ? "bg-[#5965AB] hover:bg-[#5766bc] text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            {user?.department?.departmentName === "Sales"
              ? "Submit Today's Work Summary"
              : "Add Note & Send Check-Out Request"}
          </button>
        </div>
      )}

      {/* ✅ Regular Note Dialog */}
      <Dialog open={noteModal} onOpenChange={setNoteModal}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Add Note for Late Check-Out</DialogTitle>
          </DialogHeader>

          <textarea
            placeholder="Write your note here..."
            value={note}
            rows={4}
            onChange={(e) => setNote(e.target.value)}
            className="mt-3 resize-none border border-gray-300 rounded-md "
          ></textarea>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setNoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={latecheckout}
              disabled={loadingsubmit || isCheckedOut}
              className="bg-[#5965AB] hover:bg-[#5766bc] text-white flex items-center justify-center"
            >
              {loadingsubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Sales Work Summary Dialog */}
      <Dialog open={workModal} onOpenChange={setWorkModal}>
        <DialogContent className="h-screen overflow-y-auto rounded-2xl p-6 bg-white dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              📋 Daily Work Summary
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please fill out your today’s performance details below.
            </p>
          </DialogHeader>

          {/* Sales Work Summary Form */}
          <div className="space-y-4 mt-4 p-2">
            <div>
              <label className="block text-sm mb-1">Total Calls Dialed</label>
              <input
                type="number"
                value={workData.totalCalls}
                onChange={(e) =>
                  setWorkData({ ...workData, totalCalls: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Follow-ups Done</label>
                <input
                  type="number"
                  value={workData.followUps}
                  onChange={(e) =>
                    setWorkData({ ...workData, followUps: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">New Leads Generated</label>
                <input
                  type="number"
                  value={workData.newLeads}
                  onChange={(e) =>
                    setWorkData({ ...workData, newLeads: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Sales Closed</label>
                <input
                  type="number"
                  value={workData.salesClosed}
                  onChange={(e) =>
                    setWorkData({ ...workData, salesClosed: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Meetings Conducted</label>
                <input
                  type="number"
                  value={workData.meetings}
                  onChange={(e) =>
                    setWorkData({ ...workData, meetings: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Follow-up Clients’ Names
              </label>
              <textarea
                value={workData.followUpNames}
                onChange={(e) =>
                  setWorkData({ ...workData, followUpNames: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">
                Additional Work / Notes
              </label>
              <textarea
                value={workData.notes}
                onChange={(e) =>
                  setWorkData({ ...workData, notes: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Work Satisfaction</label>
              <select
                value={workData.satisfaction}
                onChange={(e) =>
                  setWorkData({ ...workData, satisfaction: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="">Select...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Needs Improvement">
                  Needs Improvement
                </option>
              </select>
            </div>

            <div className="text-sm text-gray-500 mt-4 border-t pt-3">
              <p>
                Submitted By: <strong>{user?.name}</strong>
              </p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setWorkModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitWorkSummary}
              disabled={loadingsubmit || isCheckedOut}
              className="bg-[#5965AB] hover:bg-[#4e59a0] text-white flex items-center justify-center"
            >
              {loadingsubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "✅ Submit Work Summary"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOut;
