// components/filters/DateInput.tsx
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";

export default function DateInput({
  value,
  onChange,
  label,
  style
}: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  style: string;
}) {
  const selectedDate = value ? parseISO(value) : null;

  return (
    <div className="relative mt-5">
      {/* <label className="block text-sm text-gray-500 mb-1">{label}</label> */}
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) =>
            onChange(date ? date.toISOString().split("T")[0] : "")
          }
          placeholderText={label}
          dateFormat="yyyy-MM-dd"
          className={style}
        />
        <Calendar
          size={14}
          className="absolute right-2 top-1/2  transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
