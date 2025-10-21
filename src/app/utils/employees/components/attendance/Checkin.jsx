import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { resetCheckIn, setattendanceid, setCheckIn } from "@/features/Slice/CheckInSlice";
import { resetCheckOut } from "@/features/Slice/CheckOutSlice";
import { resetTimer, startTimer } from "@/features/Slice/StopwatchSlice";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Checkin = () => {
  const [noteModal, setNoteModal] = useState(false);
  const [loadingsubmit, setLoadingsubmit] = useState(false);
  const [note, setNote] = useState(null);
  const { isCheckedIn } = useSelector((state) => state.Checkin);
  const { user } = useSelector((state) => state.User);
  const dispatch = useDispatch();

  const [canCheckIn, setCanCheckIn] = useState(false);

  useEffect(() => {
    if (!user?.department?.checkInTime) return;

    const checkInStr = user.department.checkInTime;
    const graceMinutes = parseInt(user.department.graceTime || 30);

    const officeCheckInTime = new Date();
    const is12HourFormat =
      checkInStr.toLowerCase().includes("am") ||
      checkInStr.toLowerCase().includes("pm");

    let hours, minutes;

    if (is12HourFormat) {
      // 9:00 PM wali format
      const [time, meridiem] = checkInStr.split(" ");
      const [h, m] = time.split(":");
      hours = parseInt(h);
      minutes = parseInt(m);

      if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
    } else {
      // 24-hour format "21:00"
      [hours, minutes] = checkInStr.split(":").map((v) => parseInt(v));
    }

    officeCheckInTime.setHours(hours, minutes, 0, 0);

    // Enable BEFORE 30 mins
    const enableTime = new Date(officeCheckInTime.getTime() - 30 * 60000);
    // Disable AFTER graceTime mins
    const disableTime = new Date(
      officeCheckInTime.getTime() + graceMinutes * 60000
    );

    const now = new Date();

    if(now >= enableTime){
      dispatch(resetCheckIn())
      dispatch(resetTimer())
      dispatch(resetCheckOut())
    }

    setCanCheckIn(now >= enableTime && now <= disableTime);
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

  const normalcheckin = async () => {
    try {
      const ip = await getcurrentip();

      const now = new Date();
      const time = isoTo12Hour(now.toISOString());

      const res = await axios.post("/api/check-in", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: null,
      });

       if (res.data?.success) {
        toast.success(res.data.message || "Check-in successful!");

        dispatch(startTimer(now.getTime()));
        dispatch(setCheckIn({ time }));
        dispatch(setattendanceid(res.data.attendanceid));

        setLoadingsubmit(false);
        setNoteModal(false);
      }

    } catch (error) {

       console.error("Check-in Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Server error"
      );
    }
  };

  const latecheckout = async () => {
    try {
      setLoadingsubmit(true);

      const ip = await getcurrentip();

      const now = new Date();
      const time = isoTo12Hour(now.toISOString());

      const res = await axios.post("/api/check-in", {
        ip,
        time,
        employeeId: user?.employeeId,
        note: note || "",
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Check-in successful!");

        dispatch(startTimer(now.getTime()));
        dispatch(setCheckIn({ time }));
        dispatch(setattendanceid(res.data.attendanceid));

        setLoadingsubmit(false);
        setNoteModal(false);
      } else {
        toast.error(res.data?.message || "Something went wrong!");
        setLoadingsubmit(false);
      }
    } catch (error) {
      console.error("Check-in Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Server error"
      );
      setLoadingsubmit(false);
    }
  };

  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center  px-4">
       
        {isCheckedIn && (
          <div className="mb-6 text-lg font-medium text-green-600 flex items-center gap-2">
            <span className="text-2xl">✅</span> You’re already checked in
          </div>
        )}

        <button
          disabled={!canCheckIn || isCheckedIn}
          onClick={normalcheckin}
          className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center 
      shadow-xl transition-all duration-300 
      ${
        canCheckIn && !isCheckedIn
          ? "bg-[#5965AB] hover:bg-[#5766bc]"
          : "bg-gray-300 cursor-not-allowed"
      }`}
        >
          <CheckCircle size={80} color="white" />
        </button>

        {!canCheckIn && (
          <div className="mt-8 w-full flex justify-center">
            <button
              onClick={() => setNoteModal(true)}
              disabled={isCheckedIn}
              className={`px-6 py-3 rounded-lg font-medium shadow 
          transition-all duration-300
          ${
            !isCheckedIn
              ? "bg-[#5965AB] hover:bg-[#5766bc] text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
            >
              Add Note & Send Check-In Request
            </button>
          </div>
        )}

        
      

        
        <Dialog open={noteModal} onOpenChange={setNoteModal}>
          <DialogContent className="sm:max-w-md rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Note for Late Check-In
              </DialogTitle>
            </DialogHeader>

            <textarea
              placeholder="Write your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-3 resize-none border border-gray-300 rounded-md "
            ></textarea>

            <DialogFooter className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setNoteModal(false)}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={latecheckout}
                disabled={loadingsubmit}
                className="bg-[#5965AB] hover:bg-[#5766bc] text-white px-5 flex items-center justify-center"
              >
                {loadingsubmit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Checkin;
