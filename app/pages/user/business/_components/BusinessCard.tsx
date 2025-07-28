import classNames from "classnames";
import { JSX } from "react";

type Props = {
	title: string;
	value: string;
	icon: JSX.Element;
	iconClass: string;
	isHighLighted: boolean;
};

const BusinessCard = ({ title, value, icon, iconClass, isHighLighted }: Props) => {
	return (
		<div
			className={classNames({
				"rounded-[12px] w-full flex flex-col p-3 ": true,
				"bg-white border border-gray-200": !isHighLighted,
				"bg-[#004484] border border-gray-200 text-white": isHighLighted,
			})}
		>
			<div className="flex justify-start gap-3 items-center">
				<div className={`${iconClass}`}>
					{icon}
				</div>
				<div>
					<p>{title}</p>
					<div
						className={classNames({
							"text-lg lg:text-xl font-bold mb-1 lg:mb-2": true,
							"text-black": !isHighLighted,
							"text-white": isHighLighted,
						})}
					>
						{value}
					</div>

				</div>
			</div>
		</div>
	);
};

export default BusinessCard;
