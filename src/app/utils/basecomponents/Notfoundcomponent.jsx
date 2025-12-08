"use client"
import React from 'react'
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Notfoundcomponent = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="flex justify-center mb-4">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        <AlertTriangle className="w-16 h-16 text-yellow-400" />
                    </motion.div>
                </div>

                <h1 className="text-5xl font-extrabold mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-300 mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Oops! It seems the page you’re looking for doesn’t exist or access is restricted.
                </p>

                <div className="flex justify-center gap-3">

                    <Button
                        className="bg-[#5965AB] hover:bg-[#5362b5] text-white"
                        onClick={() => router.back()}
                    >
                        Go back
                    </Button>
                </div>
            </motion.div>

            <p className="absolute bottom-6 text-sm text-gray-500">
                © {new Date().getFullYear()} Brintor PVT LTD
            </p>
        </div>
    )
}

export default Notfoundcomponent