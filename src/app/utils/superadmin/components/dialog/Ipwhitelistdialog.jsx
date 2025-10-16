// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Trash } from "lucide-react";
// import { useSelector } from "react-redux";

// const Ipwhitelistdialog = ({ open, setOpen }) => {
  
//   const [networkName, setNetworkName] = useState("");
//   const [ip, setIp] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [loading, setLoading] = useState(false);

//    const {ipwhitelist} = useSelector((state)=>state.Ipwhitelist)

//    const [entries, setEntries] = useState(ipwhitelist);

//   const addOrUpdateEntry = () => {
//     if (!networkName.trim() || !ip.trim()) {
//       toast.error("Network Name and IP are required");
//       return;
//     }

//     if (editIndex !== null) {
//       const updated = [...entries];
//       updated[editIndex] = { networkName, ip };
//       setEntries(updated);
//       setEditIndex(null);
//       toast.success("Entry updated");
//     } else {
//       setEntries([...entries, { networkName, ip }]);
//       toast.success("Entry added");
//     }

//     setNetworkName("");
//     setIp("");
//   };

//   const editEntry = (index) => {
//     setNetworkName(entries[index].networkName);
//     setIp(entries[index].ip);
//     setEditIndex(index);
//   };

//   const removeEntry = (index) => {
//     setEntries(entries.filter((_, i) => i !== index));
//     toast.success("Entry removed");
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (entries.length === 0) {
//       toast.error("Network Not found");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "/api/create-ip-whitelist",
//         { whitelist: entries },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       if (res.data.success) {
//         toast.success("✅ Whitelist saved successfully");
//         setEntries([]);
//         setOpen(false);
//       } else {
//         toast.error(res.data.error || "Failed to save");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-[#5965AB] text-white">+ Add and Update IP Whitelist</Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Create IP Whitelist</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={submitHandler} className="space-y-4 mt-2 p-2">
//           {/* Modern Inline Inputs + Circular Add Button */}
//           <div className="flex items-center gap-3">
//             <Input
//               placeholder="Network Name"
//               className="flex-1  border-gray-300 focus:ring-2 focus:ring-[#5965AB]"
//               value={networkName}
//               onChange={(e) => setNetworkName(e.target.value)}
//             />

//             <Input
//               placeholder="IP Address"
//               className="flex-1  border-gray-300 focus:ring-2 focus:ring-[#5965AB]"
//               value={ip}
//               onChange={(e) => setIp(e.target.value)}
//             />

//             <button
//               type="button"
//               onClick={addOrUpdateEntry}
//               className="w-10 h-10 flex items-center justify-center bg-[#5965AB] text-white text-xl rounded-full"
//             >
//               +
//             </button>
//           </div>

//           {/* List of Added Entries */}
//           {entries.length > 0 && (
//             <div className="border p-2 rounded mt-4">
//               <h4 className="font-medium mb-2">Added Entries:</h4>
//               <ul className="space-y-2 h-56 overflow-y-auto">
//                 {entries.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between items-center bg-gray-100 p-2 rounded"
//                   >
//                     <span>
//                       {item.networkName} - {item.ip}
//                     </span>
//                     <div className="flex gap-2">
//                       <Button
//                         type="button"
//                         variant="secondary"
//                         onClick={() => editEntry(index)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         type="button"
                       
//                         onClick={() => removeEntry(index)}
//                       >
//                         <Trash/>
//                       </Button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               type="submit"
//               className="bg-[#5965AB] text-white w-full"
//               disabled={loading}
//             >
//               {loading ? "Saving..." : "Save Whitelist"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default Ipwhitelistdialog;


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getallipwhitelist } from "@/features/Slice/IpwhiteSlice";

const Ipwhitelistdialog = ({ open, setOpen }) => {
  const { ipwhitelist } = useSelector((state) => state.Ipwhitelist);

  const [entries, setEntries] = useState([]);
  const [networkName, setNetworkName] = useState("");
  const [ip, setIp] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()


  useEffect(() => {
    if (open && Array.isArray(ipwhitelist)) {
      setEntries(ipwhitelist);
    }
  }, [open, ipwhitelist]);

  const addOrUpdateEntry = () => {
    if (!networkName.trim() || !ip.trim()) {
      toast.error("Network Name and IP are required");
      return;
    }

    if (editIndex !== null) {
      const updated = [...entries];
      updated[editIndex] = { networkName, ip };
      setEntries(updated);
      setEditIndex(null);
      toast.success("Entry updated");
    } else {
      setEntries([...entries, { networkName, ip }]);
      toast.success("Entry added");
    }

    setNetworkName("");
    setIp("");
  };

  const editEntry = (index) => {
    setNetworkName(entries[index].networkName);
    setIp(entries[index].ip);
    setEditIndex(index);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
    toast.success("Entry removed");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (entries.length === 0) {
      toast.error("Network Not found");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/create-ip-whitelist",
        { whitelist: entries },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("✅ Whitelist saved successfully");
        dispatch(getallipwhitelist(res.data.whitelist))
        setOpen(false);
      } else {
        toast.error(res.data.error || "Failed to save");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#5965AB] text-white">
          + Add & Update IP Whitelist
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>IP Whitelist</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-2 p-2">
          {/* Inputs + Add Button */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="Network Name"
              className="flex-1 border-gray-300 focus:ring-2 focus:ring-[#5965AB]"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
            />

            <Input
              placeholder="IP Address"
              className="flex-1 border-gray-300 focus:ring-2 focus:ring-[#5965AB]"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />

            <button
              type="button"
              onClick={addOrUpdateEntry}
              className="w-10 h-10 flex items-center justify-center bg-[#5965AB] text-white text-xl rounded-full"
            >
              +
            </button>
          </div>

          {/* Entries List */}
          {entries.length > 0 && (
            <div className="border p-2 rounded mt-4">
              <h4 className="font-medium mb-2">Added Entries:</h4>
              <ul className="space-y-2 h-56 overflow-y-auto">
                {entries.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span>
                      {item.networkName} - {item.ip}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => editEntry(index)}
                      >
                        Edit
                      </Button>
                      <Button type="button" onClick={() => removeEntry(index)}>
                        <Trash />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#5965AB] text-white w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Whitelist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Ipwhitelistdialog;
