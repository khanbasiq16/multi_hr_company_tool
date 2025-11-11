"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { updatetime } from "@/features/Slice/StopwatchSlice";

const Timer = () => {
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isCheckedin, setIsCheckedin] = useState(false);
  const { user } = useSelector((state) => state.User);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.employeeId) return;

    const userRef = doc(db, "employees", user.employeeId);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStartTime(data.startTime || null);
        dispatch(updatetime(data.startTime || 0));
        setIsCheckedin(data.isCheckedin || false);
      }
    });

    return () => unsubscribe();
  }, [user?.employeeId]);

  useEffect(() => {
    let interval;

    // ✅ Run timer only when checked in & startTime exists
    if (isCheckedin && startTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const diff = Math.floor((now - start) / 1000);
        setElapsed(diff);
      }, 1000);
    } else {
      setElapsed(0); // reset timer when checked out
    }

    return () => clearInterval(interval);
  }, [isCheckedin, startTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-center font-semibold text-gray-800">
      {isCheckedin && startTime ? (
        <>
          ⏱ <span>{formatTime(elapsed)}</span>
        </>
      ) : (
        <>
          ⏱ <span>00:00:00</span>
        </>
      )}
    </div>
  );
};

export default Timer;
