// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import toast from "react-hot-toast";
// import axios from "axios";

// const EditDepartment = ({ open, setOpen, department }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     departmentName: "",
//     description: "",
//     checkInTime: "",
//     checkOutTime: "",
//     graceTime: "",
//   });


//   useEffect(() => {
//     if (department) {
//       setFormData({
//         departmentName: department.departmentName || "",
//         description: department.description || "",
//         checkInTime: department.checkInTime || "",
//         checkOutTime: department.checkOutTime || "",
//         graceTime: department.graceTime || "",
//       });
//     } else {
//       setFormData({
//         departmentName: "",
//         description: "",
//         checkInTime: "",
//         checkOutTime: "",
//         graceTime: "",
//       });
//     }
//   }, [department]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const formHandler = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Replace with your API endpoint
//       const url = department
//         ? `/api/departments/${department.departmentId}`
//         : "/api/departments";

//       const method = department ? "put" : "post";

//       await axios[method](url, formData);

//       toast.success(`Department ${department ? "updated" : "created"} successfully`);
//       setOpen(false);
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>{department ? "Edit Department" : "Create New Department"}</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={formHandler} className="space-y-4 mt-2 p-2">
//           <div>
//             <Label htmlFor="departmentName">
//               Department Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               className="mt-2"
//               id="departmentName"
//               name="departmentName"
//               placeholder="Enter department name"
//               value={formData.departmentName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Input
//               className="mt-2"
//               id="description"
//               name="description"
//               placeholder="Enter description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <Label htmlFor="checkInTime">
//               Check In Time <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               type="time"
//               className="mt-2"
//               id="checkInTime"
//               name="checkInTime"
//               value={formData.checkInTime}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="checkOutTime">
//               Check Out Time <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               type="time"
//               className="mt-2"
//               id="checkOutTime"
//               name="checkOutTime"
//               value={formData.checkOutTime}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="graceTime">
//               Grace Time <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               type="time"
//               className="mt-2"
//               id="graceTime"
//               name="graceTime"
//               placeholder="Enter minutes"
//               value={formData.graceTime}
//               onChange={handleChange}
//             />
//           </div>

//           <DialogFooter>
//             <Button type="submit" className="bg-[#5965AB] text-white" disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditDepartment;

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { parse, format } from "date-fns";

const EditDepartment = ({ open, setOpen, department }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    departmentName: "",
    description: "",
    checkInTime: "",
    checkOutTime: "",
    graceTime: "",
  });

 
  useEffect(() => {
    if (department) {
      setFormData({
        departmentName: department.departmentName || "",
        description: department.description || "",
        checkInTime: department.checkInTime
          ? format(parse(department.checkInTime, "h:mm a", new Date()), "HH:mm")
          : "",
        checkOutTime: department.checkOutTime
          ? format(parse(department.checkOutTime, "h:mm a", new Date()), "HH:mm")
          : "",
        graceTime: department.graceTime
          ? format(parse(department.graceTime, "h:mm a", new Date()), "HH:mm")
          : "",
      });
    } else {
      setFormData({
        departmentName: "",
        description: "",
        checkInTime: "",
        checkOutTime: "",
        graceTime: "",
      });
    }
  }, [department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `/api/department/${department.departmentId}`;

      const payload = {
        ...formData,
        checkInTime: formData.checkInTime
          ? format(parse(formData.checkInTime, "HH:mm", new Date()), "h:mm a")
          : "",
        checkOutTime: formData.checkOutTime
          ? format(parse(formData.checkOutTime, "HH:mm", new Date()), "h:mm a")
          : "",
        graceTime: formData.graceTime
          ? format(parse(formData.graceTime, "HH:mm", new Date()), "h:mm a")
          : "",
      };

      await axios.post(url, payload);

      toast.success(`Department ${department ? "updated" : "created"} successfully`);
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{department ? "Edit Department" : "Create New Department"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formHandler} className="space-y-4 mt-2 p-2">
          <div>
            <Label htmlFor="departmentName">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              id="departmentName"
              name="departmentName"
              placeholder="Enter department name"
              value={formData.departmentName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              className="mt-2"
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="checkInTime">
              Check In Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              className="mt-2"
              id="checkInTime"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="checkOutTime">
              Check Out Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              className="mt-2"
              id="checkOutTime"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="graceTime">
              Grace Time <span className="text-red-500">*</span>
            </Label>
            <Input
              type="time"
              className="mt-2"
              id="graceTime"
              name="graceTime"
              value={formData.graceTime}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-[#5965AB] text-white" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartment;
