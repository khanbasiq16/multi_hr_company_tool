"use client"
import Employeelayout from '@/app/utils/employees/layout/Employeelayout'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import { useAutoCheckoutSync } from '@/app/hooks/useAutoCheckoutSync'

const page = () => {
  const {slug} = useParams()
  const router = useRouter()
  const { user } = useSelector((state) => state.User);
    const { checkAutoCheckout } = useAutoCheckoutSync();

    useEffect(() => {
    checkAutoCheckout(); 
  }, []);

  return (
    <Employeelayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Employee Profile</h1>
          <Button
           onClick={() => router.push(`/employee/${slug}/mark-attendance`)}
          className="bg-[#5965AB] text-white">
            Mark Attendance
          </Button>
        </div>

        {/* Personal Info */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Full Name" value={user?.employeeName?.trim()} />
            <Detail label="Employee ID" value={user?.employeeId} />
            <Detail label="Email" value={user?.employeeemail} />
            <Detail label="Phone" value={user?.employeePhone} />
            <Detail label="CNIC" value={user?.employeeCNIC} />
            <Detail label="Address" value={user?.employeeAddress} />
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Department" value={user?.department?.departmentName} />
            <Detail label="Date of Joining" value={user?.dateOfJoining} />

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user?.status?.trim() === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {user?.status?.trim().charAt(0).toUpperCase() +
                  user?.status?.trim().slice(1)}
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </Employeelayout>
  )
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
)

export default page
