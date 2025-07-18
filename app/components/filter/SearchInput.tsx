import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  onSubmit, // Add onSubmit to props
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void; // Optional submit callback
}) {
  return (
    <div className="relative w-44">
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit?.(); // Call onSubmit if it's provided
          }
        }}
        className="mt-5 pl-8 bg-white border border-gray-200 rounded-md px-3 py-1 outline-none"
      />
      <Search
        size={14}
        className="absolute left-2 top-1/2 mt-[9px] transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
