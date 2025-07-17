// components/form/Checkbox.tsx
import React from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;