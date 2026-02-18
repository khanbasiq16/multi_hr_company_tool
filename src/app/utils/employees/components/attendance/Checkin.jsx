// "use client";
// import { CheckCircle, Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import toast from "react-hot-toast";
// import { resetTimer, startTimer } from "@/features/Slice/StopwatchSlice";
// import { setattendanceid, setCheckIn } from "@/features/Slice/CheckInSlice";
// import axios from "axios";
// import { resetCheckOut } from "@/features/Slice/CheckOutSlice";
// import { updateCheckIn, UpdateUser } from "@/features/Slice/UserSlice";

// const Checkin = ({isCheckedIn , setIsCheckedin , setIsCheckedout}) => {
//   const { user } = useSelector((state) => state.User);

//   const [canCheckIn, setCanCheckIn] = useState(false);
//   const [noteModal, setNoteModal] = useState(false);
//   const [note, setNote] = useState("");
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);

//   const fetchKarachiTime = () => {
//     try {
//       const karachiDate = new Date().toLocaleString("en-US", {
//         timeZone: "Asia/Karachi",
//       });

//       const karachiTime = new Date(karachiDate);
//       console.log("✅ Karachi Time (local):", karachiTime);
//       return karachiTime;
//     } catch (error) {
//       console.error("Failed to get Karachi time:", error);
//       return new Date();
//     }
//   };

//   const getcurrentip = async () => {
//     const ipResponse = await fetch("https://api.ipify.org?format=json");
//     const { ip } = await ipResponse.json();

//     return ip;
//   };

//   const isoTo12Hour = (isoString) => {
//     const date = new Date(isoString);

//     let hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const modifier = hours >= 12 ? "PM" : "AM";

//     if (hours === 0) {
//       hours = 12;
//     } else if (hours > 12) {
//       hours -= 12;
//     }

//     return `${hours}:${minutes} ${modifier}`;
//   };

//   useEffect(() => {
//     if (!user?.department?.checkInTime) return;

//     const checkWindow = async () => {
//       const checkInStr = user.department.checkInTime;
//       const currentTime = fetchKarachiTime();

//       const is12HourFormat =
//         checkInStr.toLowerCase().includes("am") ||
//         checkInStr.toLowerCase().includes("pm");

//       let hours, minutes;
//       if (is12HourFormat) {
//         const [time, meridiem] = checkInStr.split(" ");
//         const [h, m] = time.split(":");
//         hours = parseInt(h);
//         minutes = parseInt(m);
//         if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
//         if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
//       } else {
//         [hours, minutes] = checkInStr.split(":").map((v) => parseInt(v));
//       }

//       const officeCheckInTime = new Date(currentTime);
//       officeCheckInTime.setHours(hours, minutes, 0, 0);

//       const enableTime = new Date(officeCheckInTime.getTime() - 30 * 60000);
//       const disableTime = new Date(officeCheckInTime.getTime() + 30 * 60000);

//       setCanCheckIn(currentTime >= enableTime && currentTime <= disableTime);
//     };

//     checkWindow();
//     const interval = setInterval(checkWindow, 60 * 1000);
//     return () => clearInterval(interval);
//   }, [user]);

//   const handlecheckin = async () => {
//     if (isCheckedIn) return;
//     if (!canCheckIn) {
//       setNoteModal(true);
//     } else {
//       try {

//       const toastId = toast.loading("Checking Your identity...");
//         const ip = await getcurrentip();
//         let time = fetchKarachiTime();
//         time = isoTo12Hour(time);

//         const res = await axios.post("/api/check-in", {
//           ip,
//           time,
//           employeeId: user?.employeeId,
//           note: note || "",
//         });

//         if (res.data.success) {
//                toast.dismiss(toastId);
//           toast.success(res.data.message || "Check-in successful!");

//           dispatch(setattendanceid(res.data.attendanceid));
//           dispatch(resetCheckOut());
//            dispatch(resetTimer());
          
//           setIsCheckedin(res.data.isCheckedin);
//           setIsCheckedout(res.data.isCheckedout);
//           setNoteModal(false);
//         }
//       } catch (error) {
//              toast.dismiss(toastId);
//         console.error(error.message);
//        toast.error(error.response.data.error)
//       }
//     }
//   };

//   const handleLateCheckin = async () => {
//     setLoading(true);
//      const toastId = toast.loading("Checking Your identity...");

//     try {
//       const ip = await getcurrentip();
//       let time = fetchKarachiTime();
//       time = isoTo12Hour(time);
      

//       const res = await axios.post("/api/check-in", {
//         ip,
//         time,
//         employeeId: user?.employeeId,
//         note: note || "",
//       });

//       if (res.data.success) {
//         toast.dismiss(toastId);
//         toast.success(res.data.message || "Check-in successful!");
//         const now = new Date();

//         dispatch(setattendanceid(res.data.attendanceid));
//         dispatch(resetCheckOut());
//         setIsCheckedin(res.data.isCheckedin);
//         setIsCheckedout(res.data.isCheckedout);
//         setNoteModal(false);
//          dispatch(resetTimer());
//         setNote("");
//         setLoading(false)
//       }
//     } catch (error) {
//       toast.dismiss(toastId);
//       console.error(error.message);
//       toast.error(error.response.data.error)
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">



//         <button
//           onClick={handlecheckin}
//           disabled={isCheckedIn}
//           className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center 
//           shadow-xl transition-all duration-300
//           ${
//             isCheckedIn
//               ? "bg-gray-400 cursor-not-allowed "
//               : "bg-[#5965AB] hover:bg-[#60B89E] cursor-pointer"
//           }
//           `}
//         >
//           <CheckCircle size={80} color="white" />
//         </button>

//         <p className="mt-4 text-gray-600 text-sm text-center">
//           {isCheckedIn
//             ? "✅ You have already checked in today."
//             : canCheckIn
//             ? "✅ You can check in now (Karachi Time verified)."
//             : "⏳ You're outside the allowed time — please provide a reason when checking in."}
//         </p>
//       </div>

//       <Dialog open={noteModal} onOpenChange={setNoteModal}>
//         <DialogContent className="sm:max-w-md rounded-xl p-6">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               Reason for Late Check-In
//             </DialogTitle>
//           </DialogHeader>

//           <Textarea
//             placeholder="Write your reason here..."
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             className="mt-3 resize-none border border-gray-300 rounded-md"
//           />

//           <DialogFooter className="mt-6 flex justify-end gap-3">
//             <Button variant="outline" onClick={() => setNoteModal(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleLateCheckin}
//               disabled={loading || !note.trim()}
//               className="bg-[#5965AB] hover:bg-[#5766bc] text-white px-5 flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Checkin;


"use client";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
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
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { setattendanceid } from "@/features/Slice/CheckInSlice";
import axios from "axios";
import { resetCheckOut } from "@/features/Slice/CheckOutSlice";

const Checkin = ({ isCheckedIn, setIsCheckedin, setIsCheckedout }) => {
  const { user } = useSelector((state) => state.User);
  const [noteModal, setNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // 1. Karachi Time Fetcher
  const getKarachiTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
  };

  // 2. IP Fetcher
  const getcurrentip = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch { return "0.0.0.0"; }
  };

  // 3. Time Formatter for API
  const formatTime = (date) => {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  // --- MAIN CHECK-IN FUNCTION ---
  // const handlecheckin = async (isLateSubmission = false) => {
  //   if (isCheckedIn) return;

  //   const currentTime = getKarachiTime();
  //   const checkInStr = user?.department?.checkInTime; // Example: "08:00 PM"


    

  //   if (!checkInStr) return toast.error("Department time not found!");

  //   // Parse Department Time
  //   let [timePart, meridiem] = checkInStr.split(" ");
  //   let [hours, minutes] = timePart.split(":").map(Number);
  //   if (meridiem?.toLowerCase() === "pm" && hours < 12) hours += 12;
  //   if (meridiem?.toLowerCase() === "am" && hours === 12) hours = 0;

  //   const officeTime = new Date(currentTime);
  //   officeTime.setHours(hours, minutes, 0, 0);

  //   // 30 Minutes Late Threshold
  //   const lateThreshold = new Date(officeTime.getTime() + 30 * 60000);

  //   // AGAR LATE HAI: Aur abhi tak modal nahi khula (Normal click)
  //   if (currentTime > lateThreshold && !isLateSubmission) {
  //     setNoteModal(true);
  //     return; 
  //   }

  //   // AGAR TIME PAR HAI: Ya phir Late Reason submit ho raha hai
  //   setLoading(true);
  //   const toastId = toast.loading("Processing...");

  //   try {
  //     const ip = await getcurrentip();
  //     const res = await axios.post("/api/check-in", {
  //       ip,
  //       time: formatTime(currentTime),
  //       employeeId: user?.employeeId,
  //       note: isLateSubmission ? note : "",
  //     });

  //     if (res.data.success) {
  //       toast.dismiss(toastId);
  //       toast.success("Check-in Successful!");
  //       dispatch(setattendanceid(res.data.attendanceid));
  //       dispatch(resetCheckOut());
  //       dispatch(resetTimer());
  //       setIsCheckedin(true);
  //       setIsCheckedout(false);
  //       setNoteModal(false);
  //     }
  //   } catch (err) {
  //     toast.dismiss(toastId);
  //     toast.error(err.response?.data?.error || "Error occurred");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handlecheckin = async (isLateSubmission = false) => {
  console.log("🚀 --- Check-in Process Started ---");
  console.log("Is Late Submission (Modal Clicked):", isLateSubmission);

  if (isCheckedIn) {
    console.warn("⚠️ User is already checked in.");
    return;
  }

  const currentTime = getKarachiTime();
  console.log("🕒 Current Karachi Time:", currentTime.toString());

  const checkInStr = user?.department?.checkInTime; 
  console.log("🏢 Department Office Time (String):", checkInStr);

  if (!checkInStr) {
    console.error("❌ Error: Department check-in time is missing in user data.");
    return toast.error("Department time not found!");
  }

  // Parse Department Time Logic
  let [timePart, meridiem] = checkInStr.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  
  if (meridiem?.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (meridiem?.toLowerCase() === "am" && hours === 12) hours = 0;

  const officeTime = new Date(currentTime);
  officeTime.setHours(hours, minutes, 0, 0);
  console.log("📅 Parsed Office Time (Object):", officeTime.toString());

  // 30 Minutes Late Threshold
  const lateThreshold = new Date(officeTime.getTime() + 30 * 60000);
  console.log("⏰ Late Threshold (30 mins grace):", lateThreshold.toString());

  // Comparison Logic Log
  console.log("⚖️ Comparing: Current Time > Late Threshold?");
  const isActuallyLate = currentTime > lateThreshold;
  console.log("Result:", isActuallyLate ? "YES (Late)" : "NO (On Time/Early)");

  // --- TRIGGER MODAL OR API ---
  if (isActuallyLate && !isLateSubmission) {
    console.log("📢 User is late. Opening Note Modal...");
    setNoteModal(true);
    return; 
  }

  // AGAR TIME PAR HAI: Ya phir Late Reason submit ho raha hai
  console.log("✅ Proceeding to API call...");
  setLoading(true);
  const toastId = toast.loading("Processing...");

  try {
    const ip = await getcurrentip();
    console.log("🌐 User IP Address:", ip);

    const apiPayload = {
      ip,
      time: formatTime(currentTime),
      employeeId: user?.employeeId,
      note: isLateSubmission ? note : "",
    };
    console.log("📦 Sending Data to API:", apiPayload);

    const res = await axios.post("/api/check-in", apiPayload);
    console.log("📥 API Response:", res.data);

    if (res.data.success) {
      console.log("🎉 Check-in Success! Updating states...");
      toast.dismiss(toastId);
      toast.success("Check-in Successful!");
      
      dispatch(setattendanceid(res.data.attendanceid));
      dispatch(resetCheckOut());
      dispatch(resetTimer());
      setIsCheckedin(true);
      setIsCheckedout(false);
      setNoteModal(false);
      console.log("✅ States Updated Successfully.");
    }
  } catch (err) {
    console.error("🔥 API Error:", err.response?.data || err.message);
    toast.dismiss(toastId);
    toast.error(err.response?.data?.error || "Error occurred");
  } finally {
    setLoading(false);
    console.log("🏁 --- Check-in Process Finished ---");
  }
};

  return (
    <>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <button
          onClick={() => handlecheckin(false)}
          disabled={isCheckedIn || loading}
          className={`w-36 h-36 rounded-full flex items-center justify-center shadow-xl transition-all 
          ${isCheckedIn ? "bg-gray-400" : "bg-[#5965AB] hover:bg-[#60B89E]"}`}
        >
          {loading ? <Loader2 className="animate-spin" color="white" size={60}/> : <CheckCircle size={80} color="white" />}
        </button>
        <p className="mt-4 text-gray-600 text-sm">
          {isCheckedIn ? "✅ Checked In" : "Tap to Check-in"}
        </p>
      </div>

      <Dialog open={noteModal} onOpenChange={setNoteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reason for Late Check-In</DialogTitle></DialogHeader>
          <Textarea 
            placeholder="Reason..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteModal(false)}>Cancel</Button>
            <Button 
              onClick={() => handlecheckin(true)} // Calling same function with 'true'
              disabled={loading || !note.trim()}
              className="bg-[#5965AB]"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Checkin;