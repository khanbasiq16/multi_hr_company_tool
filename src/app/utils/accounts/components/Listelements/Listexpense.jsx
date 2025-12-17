import { Button } from '@/components/ui/button';
import React from 'react';
import toast from 'react-hot-toast'; // Make sure react-hot-toast installed

const Listexpense = () => {
    return (
        <div>
            <Button
                onClick={async () => {
                    try {
                        const res = await fetch("/api/send-expense-notification", {
                            method: "POST",
                            body: JSON.stringify({
                                email: "khanbasiq16@gmail.com",
                                Username: "Muhammad Noman",
                                amount: 5000,
                            }),
                            headers: { "Content-Type": "application/json" },
                        });

                        const data = await res.json();

                        if (data.success) {
                            toast.success("Notification sent successfully ✅");
                        } else {
                            toast.error("Failed to send notification ❌");
                        }
                    } catch (err) {
                        toast.error("Something went wrong ❌");
                        console.error(err);
                    }
                }}
            >
                Send Notification
            </Button>
        </div>
    );
};

export default Listexpense;
