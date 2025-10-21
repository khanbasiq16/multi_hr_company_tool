"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Timer = () => {
  const { isRunning, elapsedTime, startTime } = useSelector(
    (state) => state.Stopwatch
  );
  const [seconds, setSeconds] = useState(elapsedTime);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const newElapsed = elapsedTime + Math.floor((now - startTime) / 1000);
        setSeconds(newElapsed);
      }, 1000);
    } else {
      setSeconds(elapsedTime);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  return (
    <div className="w-full flex justify-center text-xl font-bold text-gray-700">
      ⏱ {formatTime(seconds)}
    </div>
  );
};

export default Timer;
