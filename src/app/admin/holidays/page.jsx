// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar as CalendarIcon, Plus, Trash2, MapPin, Clock } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const HolidayCalendarPage = () => {
//     const [events, setEvents] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedDate, setSelectedDate] = useState("");
//     const [holidayName, setHolidayName] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchHolidays = useCallback(async () => {
//         try {
//             const res = await axios.get("/api/admin/get-holidays");
//             const formatted = res.data.holidays.map(h => ({
//                 id: h._id, // Adding ID for potential deletion
//                 title: h.name,
//                 start: h.date,
//                 backgroundColor: "transparent", 
//                 borderColor: "transparent",
//                 allDay: true,
//                 extendedProps: { rawName: h.name }
//             }));
//             setEvents(formatted);
//         } catch (error) {
//             console.error("Fetch error", error);
//             toast.error("Failed to load holidays");
//         }
//     }, []);

//     useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

//     const handleDateClick = (info) => {
//         setSelectedDate(info.dateStr);
//         setIsModalOpen(true);
//     };

//     const handleSaveHoliday = async () => {
//         if (!holidayName) return toast.error("Please enter holiday name");
//         setLoading(true);
//         try {
//             await axios.post("/api/admin/add-holiday", {
//                 name: holidayName,
//                 date: selectedDate
//             });
//             toast.success("Holiday marked successfully!");
//             setHolidayName("");
//             setIsModalOpen(false);
//             fetchHolidays();
//         } catch (error) {
//             toast.error("Error saving holiday");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Custom Event Renderer for VVIP Look
//     const renderEventContent = (eventInfo) => {
//         return (
//             <div className="flex items-center px-2 py-1 bg-rose-50 border-l-4 border-rose-500 rounded shadow-sm overflow-hidden">
//                 <div className="w-2 h-2 bg-rose-500 rounded-full mr-2 shrink-0" />
//                 <span className="text-xs font-semibold text-rose-700 truncate">
//                     {eventInfo.event.title}
//                 </span>
//             </div>
//         );
//     };

//     return (
//         <SuperAdminlayout>
//             <div className="p-4 md:p-8 min-h-screen">
//                 {/* Header Section */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//                     <div>
//                         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Holiday Management</h1>
//                         <p className="text-slate-500 mt-1">Plan and manage official calendar holidays</p>
//                     </div>
//                     <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
//                         <CalendarIcon className="text-rose-500 w-5 h-5" />
//                         <span className="font-medium text-slate-700">{new Date().getFullYear()} Academic Year</span>
//                     </div>
//                 </div>



//                     {/* Right Side: Calendar */}
//                     <div className="">
//                         <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-2xl">
//                             <CardContent className="p-6">
//                                 <div className="holiday-calendar-wrapper">
//                                     <FullCalendar
//                                         plugins={[dayGridPlugin, interactionPlugin]}
//                                         initialView="dayGridMonth"
//                                         events={events}
//                                         dateClick={handleDateClick}
//                                         eventContent={renderEventContent}
//                                         height="700px"
//                                         headerToolbar={{
//                                             left: "prev,next today",
//                                             center: "title",
//                                             right: "dayGridMonth"
//                                         }}
//                                         dayMaxEvents={true}
//                                     />
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>

//                 {/* Styled Dialog */}
//                 <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                     <DialogContent className="sm:max-w-[425px] rounded-2xl">
//                         <DialogHeader>
//                             <DialogTitle className="text-2xl font-bold text-slate-800">New Holiday</DialogTitle>
//                             <DialogDescription>
//                                 Set an official holiday for <span className="text-rose-600 font-bold">{selectedDate}</span>
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="grid gap-4 py-4">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-slate-700 ml-1">Holiday Name</label>
//                                 <Input
//                                     placeholder="e.g. Independence Day"
//                                     value={holidayName}
//                                     onChange={(e) => setHolidayName(e.target.value)}
//                                     className="h-12 border-slate-200 focus:ring-rose-500 rounded-xl"
//                                 />
//                             </div>
//                         </div>
//                         <DialogFooter className="gap-2 sm:gap-0">
//                             <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
//                             <Button 
//                                 onClick={handleSaveHoliday} 
//                                 disabled={loading}
//                                 className="bg-rose-600 hover:bg-rose-700 text-white px-8 rounded-xl shadow-lg shadow-rose-200 transition-all"
//                             >
//                                 {loading ? "Saving..." : "Confirm & Save"}
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             {/* Global CSS for Calendar Customization */}
//             <style jsx global>{`
//                 .fc { --fc-border-color: #f1f5f9; --fc-button-bg-color: #ffffff; --fc-button-text-color: #64748b; --fc-button-border-color: #e2e8f0; --fc-button-hover-bg-color: #f8fafc; --fc-button-active-bg-color: #f1f5f9; }
//                 .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
//                 .fc .fc-col-header-cell { background: #f8fafc; padding: 12px 0; font-weight: 600; color: #64748b; text-transform: uppercase; font-size: 0.75rem; }
//                 .fc .fc-daygrid-day-number { padding: 10px; font-weight: 500; color: #64748b; }
//                 .fc .fc-day-today { background: #fff1f2 !important; }
//                 .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
//                 .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background-color: #f1f5f9; border-color: #e2e8f0; color: #1e293b; }
//             `}</style>
//         </SuperAdminlayout>
//     );
// };

// export default HolidayCalendarPage;


"use client";
import React, { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SuperAdminlayout from "@/app/utils/superadmin/layout/SuperAdmin";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Trash2, Edit3, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HolidayCalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [holidayName, setHolidayName] = useState("");
    const [selectedHolidayId, setSelectedHolidayId] = useState(null); // Edit ke liye ID
    const [loading, setLoading] = useState(false);

    const fetchHolidays = useCallback(async () => {
        try {
            const res = await axios.get("/api/admin/get-holidays");
            const formatted = res.data.holidays.map(h => ({
                id: h.id,
                title: h.name,
                start: h.date,
                allDay: true,
                backgroundColor: "transparent",
                borderColor: "transparent",
            }));
            setEvents(formatted);
        } catch (error) {
            toast.error("Failed to load holidays");
        }
    }, []);

    useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

    // Naya Holiday add karne ke liye
    const handleDateClick = (info) => {
        setSelectedHolidayId(null); // Reset ID
        setHolidayName(""); // Reset Name
        setSelectedDate(info.dateStr);
        setIsModalOpen(true);
    };

    // Existing Holiday ko Edit karne ke liye
    const handleEventClick = (clickInfo) => {
        setSelectedHolidayId(clickInfo.event.id);
        setHolidayName(clickInfo.event.title);
        setSelectedDate(clickInfo.event.startStr);
        setIsModalOpen(true);
    };

    // Save ya Update logic
    const handleSaveOrUpdate = async () => {
        if (!holidayName) return toast.error("Please enter holiday name");
        setLoading(true);
        try {
            if (selectedHolidayId) {


                await axios.post(`/api/admin/update-holiday/${selectedHolidayId}`, {
                    name: holidayName,
                });

                toast.success("Holiday updated!");
            } else {
                await axios.post("/api/admin/add-holiday", {
                    name: holidayName,
                    date: selectedDate
                });
                toast.success("Holiday added!");
            }
            setIsModalOpen(false);
            fetchHolidays();
        } catch (error) {
            toast.error(selectedHolidayId ? "Error updating holiday" : "Error saving holiday");
        } finally {
            setLoading(false);
        }
    };

    // Delete Logic
    const handleDeleteHoliday = async () => {
        if (!confirm("Are you sure you want to delete this holiday?")) return;
        setLoading(true);
        try {
            console.log("Deleting ID:", selectedHolidayId);
            await axios.post(`/api/admin/delete-holiday/${selectedHolidayId}`);
            toast.success("Holiday removed");
            setIsModalOpen(false);
            fetchHolidays();
        } catch (error) {
            toast.error("Error deleting holiday");
        } finally {
            setLoading(false);
        }
    };

    const renderEventContent = (eventInfo) => (
        <div className="flex items-center px-2 py-1 bg-rose-50 border-l-4 border-rose-500 rounded shadow-sm cursor-pointer hover:bg-rose-100 transition-colors">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2 shrink-0" />
            <span className="text-[11px] font-bold text-rose-700 truncate uppercase tracking-tight">
                {eventInfo.event.title}
            </span>
        </div>
    );

    return (
        <SuperAdminlayout>
            <div className="p-4 md:p-8 min-h-screen bg-[#fcfcfd]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase ">Holiday Portal</h1>
                        <p className="text-slate-500 text-sm font-medium">Click a date to add, or click an event to edit/delete.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <div className="p-2 bg-rose-100 rounded-full"><CalendarIcon className="text-rose-600 w-4 h-4" /></div>
                        <span className=" text-slate-700 tracking-tight">{new Date().getFullYear()} Schedule</span>
                    </div>
                </div>

                <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white overflow-hidden rounded-[2rem]">
                    <CardContent className="p-4 md:p-8">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick} // Yeh line add ki hai
                            eventContent={renderEventContent}
                            height="auto"
                            headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth"
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Edit/Add Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[400px] rounded-[1.5rem] border-none shadow-2xl">
                        <DialogHeader className="items-center text-center">
                            <div className={`p-3 rounded-full mb-2 ${selectedHolidayId ? 'bg-amber-100' : 'bg-rose-100'}`}>
                                {selectedHolidayId ? <Edit3 className="text-amber-600 w-6 h-6" /> : <Plus className="text-rose-600 w-6 h-6" />}
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight italic uppercase">
                                {selectedHolidayId ? "Update Holiday" : "Mark Holiday"}
                            </DialogTitle>
                            <DialogDescription className="font-medium text-slate-500">
                                Date: {selectedDate}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <label className="text-xs font-semibold text-slate-400 ml-1">Holiday Label</label>
                            <Input
                                placeholder="e.g. Winter Break"
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                                className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500 rounded-2xl mt-2 text-lg font-semibold transition-all"
                            />
                        </div>

                        <DialogFooter className="flex-col sm:flex-row gap-3">
                            {selectedHolidayId && (
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteHoliday}
                                    disabled={loading}
                                    className="rounded-xl h-12 flex-1 font-bold order-2 sm:order-1"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </Button>
                            )}
                            <Button
                                onClick={handleSaveOrUpdate}
                                disabled={loading}
                                className={`${selectedHolidayId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-black'} text-white h-12 flex-[2] rounded-xl font-bold shadow-lg transition-all order-1 sm:order-2`}
                            >
                                {loading ? "Processing..." : selectedHolidayId ? "Update Record" : "Save Holiday"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <style jsx global>{`
                .fc .fc-toolbar-title { font-weight: 900; text-transform: uppercase; font-style: italic; letter-spacing: -0.05em; color: #0f172a; }
                .fc .fc-button-primary { border-radius: 12px !important; font-weight: 700 !important; text-transform: capitalize !important; }
                .fc .fc-daygrid-day-number { font-weight: 800; opacity: 0.6; }
                .fc .fc-col-header-cell-cushion { text-decoration: none !important; color: #94a3b8; font-weight: 700; font-size: 0.7rem; }
            `}</style>
        </SuperAdminlayout>
    );
};

export default HolidayCalendarPage;