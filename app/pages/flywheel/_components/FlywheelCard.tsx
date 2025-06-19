import React from 'react';
import classNames from 'classnames';
import { LucideIcon } from 'lucide-react';

interface FlywheelCardProps {
	isHighLighted?: boolean;
	title: string;
	icon?: LucideIcon;
	value: number | string;
	percentage?: string;
	description?: string;
}

const FlywheelCard: React.FC<FlywheelCardProps> = ({
	isHighLighted = false,
	title,
	icon: Icon,
	value,
	percentage = '',
	description = '',
}) => {
	return (
		<div
			className={classNames(
				'rounded-[12px] w-full flex flex-col p-4',
				{
					'bg-white border border-gray-200 text-black': !isHighLighted,
					'bg-[#3352FF] border border-gray-200 text-white': isHighLighted,
				}
			)}
		>
			<div className="flex justify-between items-center">
				<p>{title}</p>
				{Icon && (
					<div className="rounded-full border border-[#3352FF] bg-blue-100 p-2">
						<Icon size={16} color="blue" />
					</div>
				)}
			</div>
			<span className="text-[32px] font-bold mt-8 mb-2">{value}</span>
			{(percentage || description) && (
				<div className="flex gap-2 items-center">
					{percentage && (
						<div className="border-1 border-green-500 bg-green-100 rounded-[4px]">
							<span className="text-[12px] px-2 text-green-600">{percentage}</span>
						</div>
					)}
					{description && (
						<span className="text-[13px]">{description}</span>
					)}
				</div>
			)}
		</div>
	);
};

export default FlywheelCard;
