"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false) 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    setErrors({ ...errors, [e.target.id]: "" })
  }

  const validateForm = () => {
    let valid = true
    let newErrors = { email: "", password: "" }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      valid = false
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await axios.post("/api/admin/signup", formData , {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      if (response.data.success) {
        toast.success(response.data.message)
        
        setFormData({ name: "", email: "", password: "" })
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hr Admin Consultation Tool</CardTitle>
          <CardDescription>Enter your details to sign in</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {message && <p className="text-sm text-red-500">{message}</p>}
          </CardContent>

          <CardFooter className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setFormData({ name: "", email: "", password: "" })}>Cancel</Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
