// app/TimerWatcher.jsx
"use client";
import { resetCheckIn } from "@/features/Slice/CheckInSlice";
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function TimerWatcher() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);
  const { isRunning } = useSelector((state) => state.Stopwatch); // optional: check if timer is running

  const fetchKarachiTime = () => {
    try {
      const karachiDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      });
      return new Date(karachiDate);
    } catch {
      return new Date();
    }
  };

  useEffect(() => {
    if (!user?.department?.checkOutTime) return;

    const monitorCheckoutTime = () => {
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

      const graceEndTime = new Date(officeCheckOutTime.getTime() + 30 * 60000); // +30 minutes

      if (currentTime >= graceEndTime && isRunning) {
        console.log("⏱ Grace period over — resetting timer and check-in...");
        dispatch(resetTimer());
        dispatch(resetCheckIn()); // optional
      }
    };

    // Immediately check and then keep checking every minute
    monitorCheckoutTime();
    const interval = setInterval(monitorCheckoutTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isRunning, dispatch]);

  return null; // invisible watcher
}
