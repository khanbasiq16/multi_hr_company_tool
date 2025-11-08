import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const MonthPicker = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(value ? +value.split("-")[0] : new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(value ? +value.split("-")[1] - 1 : new Date().getMonth());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 11 }, (_, i) => 2025 - 5 + i); // 5 years before and after 2025

  const handleSelect = () => {
    const monthValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    onChange(monthValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-52 justify-start pl-3 text-left rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        >
          {value ? `${months[selectedMonth]} ${selectedYear}` : "Select Month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex flex-col gap-4">
          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(+e.target.value)}
            className="border rounded-md p-2 dark:bg-gray-900 dark:text-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Month Selector */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMonth(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>

          {/* Confirm Button */}
          <Button onClick={handleSelect} className="mt-2">
            Select
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
