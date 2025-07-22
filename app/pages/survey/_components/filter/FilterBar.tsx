"use client";

import DateInput from "@/app/components/filter/DateInput";
import SearchInput from "@/app/components/filter/SearchInput";

type Props = {
  tempSearch?: string | null;
  setTempSearch?: ((val: string) => void) | null;
  tempStartDate: string;
  setTempStartDate: (val: string) => void;
  tempEndDate: string;
  setTempEndDate: (val: string) => void;
  onFilter: () => void;
};

export default function FilterBar({
  tempSearch,
  setTempSearch,
  tempStartDate,
  setTempStartDate,
  tempEndDate,
  setTempEndDate,
  onFilter,
}: Props) {
  return (
    <div className="flex justify-between w-full gap-3 flex-wrap">
      <div className="flex justify-start gap-3 flex-wrap">
        {tempSearch !== undefined && setTempSearch && (
          <SearchInput
            value={tempSearch ?? ""}
            onChange={setTempSearch}
            onSubmit={onFilter}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 flex-wrap">
        <DateInput
          value={tempStartDate}
          onChange={setTempStartDate}
          label="Start Date"
          style="w-34 px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
        />

        <DateInput
          value={tempEndDate}
          onChange={setTempEndDate}
          label="End Date"
          style="w-34 px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
        />

        <button
          className="px-4 py-1 mt-5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer"
          onClick={onFilter}
        >
          Filter
        </button>
      </div>
    </div>
  );
}
