"use client"
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "@/features/Slice/UserSlice";
import { resetTimer } from "@/features/Slice/StopwatchSlice";
import { resetCheckIn } from "@/features/Slice/CheckInSlice";
import { resetCheckOut } from "@/features/Slice/CheckOutSlice";
import { useRouter } from "next/navigation";
import axios from "axios";

export const useEmployeeStatusListener = (uid) => {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!uid) return;

        const ref = doc(db, "employees", uid);

        const unsub = onSnapshot(ref, async (snap) => {
            const data = snap.data();

            if (data?.status === "deactivate") {
                const response = await axios.get("/api/logout");
                if (response.data.success) {
                    dispatch(logout());
                    dispatch(resetTimer());
                    dispatch(resetCheckIn());
                    dispatch(resetCheckOut());
                    router.push("/");
                }
            }
        });

        return () => unsub();
    }, [uid]);
};
