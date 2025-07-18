// components/filters/DepartmentFilter.tsx
import { Department } from "@/app/lib/type";
import { Funnel } from "lucide-react";

export default function DepartmentFilter({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (val: string) => void;
    options: Department[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-5 px-5 bg-white border border-gray-200  rounded-md py-[6px] outline-none"
            >
                <option value="" className="text-gray-400">Filter by department</option>
                {options.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.departmentName}
                    </option>
                ))}
            </select>
            <Funnel size={13} className="absolute top-1/2 mt-[10px] mr-2  text-gray-400 left-2 transform -translate-y-1/2" />
        </div>

    );
}
