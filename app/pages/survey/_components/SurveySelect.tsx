type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  valuesList: string[];
};

const SurveySelect = ({ value, onChange, valuesList }: Props) => {
  return (
    <div className="w-full">
      <select
        id="questionType"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-3 outline-none bg-white text-sm"
      >
        {valuesList.map((value) => (
          <option key={value} value="multiple_choice">
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SurveySelect;
