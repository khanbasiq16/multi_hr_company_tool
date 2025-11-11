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
import toast from "react-hot-toast";
import { resetTimer, startTimer } from "@/features/Slice/StopwatchSlice";
import { setattendanceid, setCheckIn } from "@/features/Slice/CheckInSlice";
import axios from "axios";
import { resetCheckOut } from "@/features/Slice/CheckOutSlice";
import { updateCheckIn, UpdateUser } from "@/features/Slice/UserSlice";

const Checkin = ({isCheckedIn , setIsCheckedin , setIsCheckedout}) => {
  const { user } = useSelector((state) => state.User);

  const [canCheckIn, setCanCheckIn] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchKarachiTime = () => {
    try {
      const karachiDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      });

      const karachiTime = new Date(karachiDate);
      console.log("✅ Karachi Time (local):", karachiTime);
      return karachiTime;
    } catch (error) {
      console.error("Failed to get Karachi time:", error);
      return new Date();
    }
  };

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

  useEffect(() => {
    if (!user?.department?.checkInTime) return;

    const checkWindow = async () => {
      const checkInStr = user.department.checkInTime;
      const currentTime = fetchKarachiTime();

      const is12HourFormat =
        checkInStr.toLowerCase().includes("am") ||
        checkInStr.toLowerCase().includes("pm");

      let hours, minutes;
      if (is12HourFormat) {
        const [time, meridiem] = checkInStr.split(" ");
        const [h, m] = time.split(":");
        hours = parseInt(h);
        minutes = parseInt(m);
        if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
      } else {
        [hours, minutes] = checkInStr.split(":").map((v) => parseInt(v));
      }

      const officeCheckInTime = new Date(currentTime);
      officeCheckInTime.setHours(hours, minutes, 0, 0);

      const enableTime = new Date(officeCheckInTime.getTime() - 30 * 60000);
      const disableTime = new Date(officeCheckInTime.getTime() + 30 * 60000);

      setCanCheckIn(currentTime >= enableTime && currentTime <= disableTime);
    };

    checkWindow();
    const interval = setInterval(checkWindow, 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handlecheckin = async () => {
    if (isCheckedIn) return;
    if (!canCheckIn) {
      setNoteModal(true);
    } else {
      const toastId = toast.loading("Checking Your identity...");
      try {
        const ip = await getcurrentip();
        let time = fetchKarachiTime();
        time = isoTo12Hour(time);

        const res = await axios.post("/api/check-in", {
          ip,
          time,
          employeeId: user?.employeeId,
          note: note || "",
        });

        if (res.data.success) {
               toast.dismiss(toastId);
          toast.success(res.data.message || "Check-in successful!");

          dispatch(setattendanceid(res.data.attendanceid));
          dispatch(resetCheckOut());
           dispatch(resetTimer());
          
          setIsCheckedin(res.data.isCheckedin);
          setIsCheckedout(res.data.isCheckedout);
          setNoteModal(false);
        }
      } catch (error) {
             toast.dismiss(toastId);
        console.error(error.message);
       toast.error(error.response.data.error)
      }
    }
  };

  const handleLateCheckin = async () => {
    setLoading(true);
     const toastId = toast.loading("Checking Your identity...");

    try {
      const ip = await getcurrentip();
      let time = fetchKarachiTime();
      time = isoTo12Hour(time);
      

      const res = await axios.post("/api/check-in", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: note || "",
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success(res.data.message || "Check-in successful!");
        const now = new Date();

        dispatch(setattendanceid(res.data.attendanceid));
        dispatch(resetCheckOut());
        setIsCheckedin(res.data.isCheckedin);
        setIsCheckedout(res.data.isCheckedout);
        setNoteModal(false);
         dispatch(resetTimer());
        setNote("");
        setLoading(false)
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error.message);
      toast.error(error.response.data.error)
      setLoading(true);
    }
  };

  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <button
          onClick={handlecheckin}
          disabled={isCheckedIn}
          className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center 
          shadow-xl transition-all duration-300
          ${
            isCheckedIn
              ? "bg-gray-400 cursor-not-allowed "
              : "bg-[#5965AB] hover:bg-[#60B89E] cursor-pointer"
          }`}
        >
          <CheckCircle size={80} color="white" />
        </button>

        <p className="mt-4 text-gray-600 text-sm text-center">
          {isCheckedIn
            ? "✅ You have already checked in today."
            : canCheckIn
            ? "✅ You can check in now (Karachi Time verified)."
            : "⏳ You're outside the allowed time — please provide a reason when checking in."}
        </p>
      </div>

      {/* ✅ Late Check-In Dialog */}
      <Dialog open={noteModal} onOpenChange={setNoteModal}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Reason for Late Check-In
            </DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Write your reason here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-3 resize-none border border-gray-300 rounded-md"
          />

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setNoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLateCheckin}
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

export default Checkin;
