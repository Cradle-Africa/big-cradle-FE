import React from "react";
import { Plus } from "lucide-react";

type AddFieldButtonProps = {
  index: number;
  totalFields: number;
  onAdd: () => void;
};

const AddFieldButton: React.FC<AddFieldButtonProps> = ({ index, totalFields, onAdd }) => {
  if (index !== totalFields - 1) return null;

  return (
    <div className="bg-white rounded-lg p-2 h-full flex items-center justify-top">
      <button
        type="button"
        onClick={onAdd}
        className="text-blue-600 border border-blue-600 p-1 cursor-pointer rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default AddFieldButton;
