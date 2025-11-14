"use client";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { resetCheckIn } from "@/features/Slice/CheckInSlice";
import { setCheckOut } from "@/features/Slice/CheckOutSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { updateCheckOut, UpdateUser } from "@/features/Slice/UserSlice";

const CheckOut = ({
  isCheckedIn,
  isCheckedout,
  setIsCheckedout,
  setIsCheckedin,
}) => {
  const { attendenceid } = useSelector((state) => state.Checkin);

  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();

  const [canCheckOut, setCanCheckout] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { isRunning, elapsedTime, startTime } = useSelector(
    (state) => state.Stopwatch
  );

  const fetchKarachiTime = () => {
    try {
      const karachiDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      });
      return new Date(karachiDate);
    } catch (error) {
      console.error("Failed to get Karachi time:", error);
      return new Date();
    }
  };

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

    const checkWindow = () => {
      const checkOutStr = user.department.checkOutTime;
      const currentTime = fetchKarachiTime();

      const is12HourFormat =
        checkOutStr.toLowerCase().includes("am") ||
        checkOutStr.toLowerCase().includes("pm");

      let hours, minutes;
      if (is12HourFormat) {
        const [time, meridiem] = checkOutStr.split(" ");
        const [h, m] = time.split(":");
        hours = parseInt(h);
        minutes = parseInt(m);
        if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
      } else {
        [hours, minutes] = checkOutStr.split(":").map((v) => parseInt(v));
      }

      const officeCheckOutTime = new Date(currentTime);
      officeCheckOutTime.setHours(hours, minutes, 0, 0);

      const enableTime = new Date(officeCheckOutTime.getTime() - 30 * 60000);
      const disableTime = new Date(officeCheckOutTime.getTime() + 30 * 60000);

      setCanCheckout(currentTime >= enableTime && currentTime <= disableTime);
    };

    checkWindow();
    const interval = setInterval(checkWindow, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const getcurrentip = async () => {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipResponse.json();

    return ip;
  };

  const isoTo12Hour = (isoString) => {
    const date = new Date(isoString);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const modifier = hours >= 12 ? "PM" : "AM";

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${hours}:${minutes} ${modifier}`;
  };

  const handleCheckOut = async () => {
    const currentTime = fetchKarachiTime();
    const checkOutStr = user.department.checkOutTime;

    const is12HourFormat =
      checkOutStr.toLowerCase().includes("am") ||
      checkOutStr.toLowerCase().includes("pm");

    let hours, minutes;
    if (is12HourFormat) {
      const [time, meridiem] = checkOutStr.split(" ");
      const [h, m] = time.split(":");
      hours = parseInt(h);
      minutes = parseInt(m);
      if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
    } else {
      [hours, minutes] = checkOutStr.split(":").map((v) => parseInt(v));
    }

    const officeCheckOutTime = new Date(currentTime);
    officeCheckOutTime.setHours(hours, minutes, 0, 0);

    const earlyTime = new Date(officeCheckOutTime.getTime() - 30 * 60000);
    const lateTime = new Date(officeCheckOutTime.getTime() + 30 * 60000);

    if (currentTime < earlyTime) {
      setDialogType("early");
      setDialogOpen(true);
      return;
    }

    if (currentTime > lateTime) {
      setDialogType("late");
      setDialogOpen(true);
      return;
    }

    //    const currentTime = fetchKarachiTime(); // current Karachi time
    // const checkOutStr = user.department.checkOutTime;
    // const checkInStr = user.department.checkInTime ; // added checkInTime support

    // // ✅ Function to convert 12-hour to Date object
    // const parseTime12Hour = (timeStr) => {
    //   const [time, meridiem] = timeStr.trim().split(" ");
    //   let [hours, minutes] = time.split(":").map(Number);
    //   if (meridiem?.toLowerCase() === "pm" && hours < 12) hours += 12;
    //   if (meridiem?.toLowerCase() === "am" && hours === 12) hours = 0;

    //   const date = new Date();
    //   date.setHours(hours, minutes || 0, 0, 0);
    //   return date;
    // };

    // const deptCheckIn = parseTime12Hour(checkInStr);
    // const deptCheckOut = parseTime12Hour(checkOutStr);

    // if (deptCheckOut < deptCheckIn) {
    //   deptCheckOut.setDate(deptCheckOut.getDate() + 1);
    // }

    // const officeCheckOutTime = deptCheckOut;
    // const earlyTime = new Date(officeCheckOutTime.getTime() - 30 * 60000);
    // const lateTime = new Date(officeCheckOutTime.getTime() + 30 * 60000);

    // const adjustedCurrent = new Date(currentTime);
    // if (deptCheckOut < deptCheckIn && adjustedCurrent < deptCheckIn) {
    //   adjustedCurrent.setDate(adjustedCurrent.getDate() + 1);
    // }

    // console.log("Current:", adjustedCurrent);
    // console.log("Office CheckOut:", officeCheckOutTime);

    // // 🧩 Compare
    // if (adjustedCurrent < earlyTime) {
    //   setDialogType("early");
    //   setDialogOpen(true);
    //   return;
    // }

    // if (adjustedCurrent > lateTime) {
    //   setDialogType("late");
    //   setDialogOpen(true);
    //   return;
    // }

    const toastId = toast.loading("Checking Your identity...");
    try {
      const ip = await getcurrentip();
      let time = fetchKarachiTime();
      time = isoTo12Hour(time);

      const start = new Date(elapsedTime).getTime();
      const now = Date.now();
      const diffInSeconds = Math.floor((now - start) / 1000);

      const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      };

      const totalWorkedTime = formatElapsedTime(diffInSeconds);

      const res = await axios.post("/api/check-out", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: null,
        stopwatchTime: totalWorkedTime,
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success("Checked out successfully!");
        
        dispatch(resetCheckIn());
        setIsCheckedin(res.data.isCheckedin);
        setIsCheckedout(res.data.isCheckedout);
        dispatch(updateCheckOut());
        setDialogOpen(false);
        dispatch(resetTimer());
        setNote("");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);

      toast.error(error.response.data.error);
    }
  };

  const handleSubmitReason = async () => {
    setLoading(true);
    const toastId = toast.loading("Checking Your identity...");
    try {
      const ip = await getcurrentip();
      let time = fetchKarachiTime();
      time = isoTo12Hour(time);

      const start = new Date(elapsedTime).getTime();
      const now = Date.now();
      const diffInSeconds = Math.floor((now - start) / 1000);

      const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      };

      const totalWorkedTime = formatElapsedTime(diffInSeconds);

      console.log("🕒 Total Worked Time:", totalWorkedTime);

      const res = await axios.post("/api/check-out", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: note,
        stopwatchTime: totalWorkedTime,
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success("Checked out successfully!");
        dispatch(resetCheckIn());
        dispatch(updateCheckOut());
        dispatch(resetTimer());
        setIsCheckedin(res.data.isCheckedin);
        setIsCheckedout(res.data.isCheckedout);
        setDialogOpen(false);
        setNote("");
        setLoading(false);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Failed to submit reason:", error);
      toast.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <button
          disabled={!isCheckedIn || isCheckedout}
          onClick={handleCheckOut}
          className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            isCheckedIn && !isCheckedout
              ? "bg-[#5965AB] hover:bg-[#60B89E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <CheckCircle size={80} color="white" />
        </button>

        <p className="mt-4 text-gray-600 text-sm text-center">
          {isCheckedIn && !isCheckedout
            ? "✅ You are currently checked in. You can check out anytime today."
            : canCheckOut
            ? "✅ You can check out now (Karachi time verified)."
            : "⏳ You're outside the allowed time — please provide a reason when checking out."}
        </p>
      </div>

      {/* ✅ Early/Late Check-Out Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Reason for Early or Late Check-Out
              {/* {dialogType === "early"
                ? "Reason for Early or Late Check-Out"
                : "Reason for Late Check-Out"} */}
            </DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Write your reason here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-3 resize-none border border-gray-300 rounded-md"
          />

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReason}
              disabled={loading || !note.trim()}
              className="bg-[#5965AB] hover:bg-[#5766bc] text-white px-5 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckOut;
