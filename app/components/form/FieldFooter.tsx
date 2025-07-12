import React from "react";
import { Trash2 } from "lucide-react";

type FieldFooterProps = {
  index: number;
  fieldType: string;
  isRequired: boolean;
  onToggleRequired: (index: number, value: boolean) => void;
  onRemove: (index: number) => void;
};

const FieldFooter: React.FC<FieldFooterProps> = ({
  index,
  fieldType,
  isRequired,
  onToggleRequired,
  onRemove,
}) => {
  const checkboxId = `${fieldType}-${index}`;

  return (
    <div className="flex justify-end items-center gap-5 mt-5 border-t border-gray-100 pt-3">
      <div className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={checkboxId}
          checked={isRequired}
          onChange={(e) => onToggleRequired(index, e.target.checked)}
          className="mr-2 outline-none"
        />
        <label htmlFor={checkboxId} className="text-sm">
          Required
        </label>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="flex items-center text-sm cursor-pointer"
      >
        <Trash2 size={15} className="inline mr-1" /> Remove
      </button>
    </div>
  );
};

export default FieldFooter;
