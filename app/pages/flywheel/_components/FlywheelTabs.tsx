import classNames from "classnames";

type FlyWheelTabProps = {
	label: string;
	isSelected: boolean;
	onClick: () => void;
};

const FlywheelTab: React.FC<FlyWheelTabProps> = ({ label, isSelected, onClick }) => {
	return (
		<div
			className={classNames(
				"px-3 rounded-full py-1 transition-all",
				{
					"bg-blue-50 border border-blue-500 text-blue-600": isSelected,
					"text-gray-500 hover:bg-gray-100": !isSelected,
				}
			)}
		>
			<button onClick={onClick} className="cursor-pointer font-medium">
				{label}
			</button>
		</div>
	);
};

export default FlywheelTab;
