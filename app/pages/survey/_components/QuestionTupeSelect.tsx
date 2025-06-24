const QuestionTypeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="w-full max-w-sm">
      <select
        id="questionType"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-3 outline-none bg-white text-sm"
      >
        <option value="multiple_choice">Multiple Choice</option>
        <option value="rating_scale">Rating Scale</option>
        <option value="text_input">Text Input</option>
        <option value="image_upload">Image Upload</option>
      </select>
    </div>
  );
};

export default QuestionTypeSelect;
