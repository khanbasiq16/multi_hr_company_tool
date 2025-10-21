"use client"
import Employeelayout from '@/app/utils/employees/layout/Employeelayout'
import React, { useState } from 'react'


import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import Checkin from '@/app/utils/employees/components/attendance/Checkin'
import CheckOut from '@/app/utils/employees/components/attendance/CheckOut'
import { useParams } from 'next/navigation'
const Page = () => {
  const [selected, setSelected] = useState("checkin")
  const {slug} = useParams()

  return (
    <Employeelayout>
      
      <div className="w-full px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-md  font-semibold text-gray-700">
          Employee {">"} {slug.replace(/-/g, " ")} {">"} mark attendance
        </h2>

       
        <Select  onValueChange={(value) => setSelected(value)}>
          <SelectTrigger className="w-40 bg-white">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checkin">Check In</SelectItem>
            <SelectItem value="checkout">Check Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Render Components */}
      <div className="p-6">
        {selected === "checkin" && <Checkin />}
        {selected === "checkout" && <CheckOut />}
        {!selected && (
          <p className="text-gray-500 text-center py-10">
            Please select an option to continue.
          </p>
        )}
      </div>
    </Employeelayout>
  )
}

export default Page
