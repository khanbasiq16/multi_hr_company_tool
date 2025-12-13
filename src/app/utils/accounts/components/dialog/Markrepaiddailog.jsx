"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import axios from "axios"

const MarkRepaidDialog = ({ record, bank, setBank }) => {

  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [open, setOpen] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      let checkamount = parseFloat(record?.amountdata)

      console.log(checkamount)

      let disturbamount = parseFloat(checkamount) - parseFloat(amount)

      console.log(disturbamount)

      if (parseFloat(bank?.balance.toFixed(2)) < parseFloat(amount)) {
        toast.error("Insufficient balance")
        return
      }

      let status = "repaid"
      let repaymentstatus = "Unpaid"

      if (parseFloat(amount) > parseFloat(checkamount.toFixed(2))) {
        toast.error("Amount is greater than the loan amount")
        return
      }

      if (parseFloat(amount) < parseFloat(checkamount.toFixed(2))) {
        status = "partially"
      }
      if (parseFloat(amount) === parseFloat(checkamount.toFixed(2))) {
        status = "repaid"
        repaymentstatus = "repaid"
      }

      const res = await axios.post("/api/acounts/banks/mark-repaid", {
        loanid: record?.loanid,
        bankid: bank?.bankid,
        amount,
        repaystatus: status,
        repaymentstatus,
        disturbamount
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (res.data.success) {
        toast.success("Loan marked as repaid")
        setBank(res.data.bank);
        setOpen(false)
        setAmount("")
      }

    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.error || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">Repay Loan</Button>
      </DialogTrigger>


      <DialogContent className="max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Mark Loan as Repaid
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-3">

          <div>
            <Label className="font-medium">Amount</Label>
            <div className="flex mt-1">
              <span className="px-4 bg-gray-200 text-gray-700 rounded-l-md flex items-center border">
                {bank?.currency?.symbol}
              </span>

              <Input
                name="amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-l-none border-l-0  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                required
              />
            </div>
          </div>



          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#5965AB] hover:bg-[#4e589c] text-white"
            >
              {loading ? "Processing..." : "Repay Loan"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MarkRepaidDialog
