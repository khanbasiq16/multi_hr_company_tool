"use client"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { updateCheckOut } from "@/features/Slice/UserSlice";

export const useAutoCheckoutSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);

  const checkAutoCheckout = async () => {
    if (!user?.employeeId) return;

    try {
      const res = await axios.get("/api/attendance/dailyCheck");

      if (res.data.success && res.data.updatedEmployees?.length > 0) {
        const found = res.data.updatedEmployees.find(
          (emp) => emp.employeeId === user.employeeId
        );

        if (found && found.checkout?.status === "Auto Checkout") {
          dispatch(updateCheckOut());
        } else if (found && found.checkout?.status === "Late Checkout") {
          dispatch(updateCheckOut());
        }
      } else {
        console.log("No auto checkouts found for today.");
      }
    } catch (error) {
      console.error("Auto checkout sync failed:", error);
      toast.error("❌ Auto checkout sync failed");
    }
  };

  return { checkAutoCheckout };
};
