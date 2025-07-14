import React from "react";
import { Plus } from "lucide-react";

type AddFieldButtonProps = {
  totalFields: number;
  onAdd: () => void;
};

const AddFieldButton: React.FC<AddFieldButtonProps> = ({ onAdd }) => {

  return (
    <button
      type="button"
      onClick={onAdd}
      className="flex items-center text-blue-600 border border-blue-600 p-1 cursor-pointer rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
    >
      <Plus size={16} className="inline" /> Add field
    </button>
  );
};

export default AddFieldButton;
