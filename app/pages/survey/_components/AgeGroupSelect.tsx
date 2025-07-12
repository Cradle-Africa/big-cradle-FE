import { AgeGroupOption } from "@/app/lib/type";
import React, { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  registration: UseFormRegisterReturn;
};
const AgeGroupSelect = ({ registration }: Props) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");

  return (
    <div className="mt-4 mb-4">
      <label htmlFor="age-group" className="block mb-2 font-medium">
        Select Age Group
      </label>
      <select
        {...registration}
        id="age-group"
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        value={selectedAgeGroup}
        onChange={(e) => setSelectedAgeGroup(e.target.value)}
      >
        {ageGroups.map((group) => (
          <option key={group.value} value={group.value}>
            {group.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ageGroups: AgeGroupOption[] = [
  // { value: "0-12 : Children", label: "0–12: Children" },
  // { value: "13-17: Teens / Adolescents", label: "13–17: Teens / Adolescents" },
  { value: "18-24: Young Adults", label: "18–24: Young Adults" },
  {
    value: "25-34: Millennials / Early career",
    label: "25–34: Millennials / Early career",
  },
  { value: "35-44: Mid-career adults", label: "35–44: Mid-career adults" },
  { value: "45-54: Mature adults", label: "45–54: Mature adults" },
  { value: "55-64: Pre-retirement age", label: "55–64: Pre-retirement age" },
  { value: "65+: Seniors / Elderly", label: "65+: Seniors / Elderly" },
];

export default AgeGroupSelect;
