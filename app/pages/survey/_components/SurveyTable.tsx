import { PaginationMeta, SurveyListItem } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Calendar } from "lucide-react";
import Image from "next/image";
import radialIcon from '@/public/radial.png'
import { useRouter } from "next/navigation";
import DataPointActions from "../../flywheel/_components/DataPointActions";
import { useState } from "react";
import FilterBar from "./filter/FilterBar";
import { Spinner } from "@radix-ui/themes";
import Pagination from "./Pagination";
import SurveyActions from "./SurveyActions";
import SurveyStatus from "../status/SurveyStatus";

type Props = {
	data: SurveyListItem[];
	pagination: PaginationMeta;
	selectedStartDate: string;
	selectedEndDate: string;
	search: string;
	setSearch: (val: string) => void;
	setSelectedStartDate: (val: string) => void;
	setSelectedEndDate: (val: string) => void;
	onPageChange: (newPage: number) => void;
	onLimitChange: (newLimit: number) => void;
	loading: boolean;
};

const SurveyTable = ({
	data,
	pagination,
	selectedStartDate,
	selectedEndDate,
	search,
	setSearch,
	setSelectedStartDate,
	setSelectedEndDate,
	onPageChange,
	onLimitChange,
	loading,
}: Props) => {

	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [uniqueId, setUniqueId] = useState<string>('');
	const [selectedSurvey, setSelectedSurvey] = useState<SurveyListItem | null>(null);
	const [activateOpen, setActivateOpen] = useState(false);
	const [suspendOpen, setSuspendOpen] = useState(false);

	const [tempStartDate, setTempStartDate] = useState(selectedStartDate);
	const [tempEndDate, setTempEndDate] = useState(selectedEndDate);
	const [tempSearch, setTempSearch] = useState(search);

	const [, setPage] = useState(pagination.page);
	const [limit, setLimit] = useState(pagination.limit);

	const router = useRouter();

	// if (data.length < 1)
	// 	return (
	// 		<div className="flex flex-col items-center gap-5 justify-center py-8">
	// 			<ImFileEmpty />
	// 			<p>No Data</p>
	// 		</div>
	// 	);

	return (
		<div>
			<FilterBar
				tempSearch={tempSearch}
				setTempSearch={setTempSearch}
				tempStartDate={tempStartDate}
				setTempStartDate={setTempStartDate}
				tempEndDate={tempEndDate}
				setTempEndDate={setTempEndDate}
				onFilter={() => {
					setSelectedStartDate(tempStartDate);
					setSelectedEndDate(tempEndDate);
					setSearch(tempSearch);
					onPageChange(1);
					onLimitChange(limit);
				}}
			/>
			{loading ? (
				<div className="mt-5"><Spinner /></div>
			) : (
				<div className="grid grid-cols-1 md:grid md:grid-cols-2  2xl:grid 2xl:grid-cols-3 w-full gap-5 mt-5">
					{data.map((survey, index) => {
						return (
							<div
								key={index}
								onClick={() =>
									router.push(`/pages/survey/${survey?.id}`)
								}
								className="flex flex-col group border-1 bg-white border-gray-200 rounded-lg px-6 py-6 cursor-pointer
                                 hover:border-1 hover:border-blue-200 transition-all ease-in-out transform-fill hover:transform-fill "
							>
								<div className="flex flex-nowrap items-center justify-between">
									<div className="inline-block items-center">
										<Image
											src={radialIcon}
											width={15}
											height={8}
											alt={'Big cradle logo'}
											className="inline text-inherit"
										/>
										<h2 className="inline ml-2 text-[18px] text-[#0C0C0C] ">
											{survey.surveyName}
										</h2>
									</div>

									<SurveyActions
										index={index}
										openIndex={openIndex}
										status={survey.isActive}
										setOpenIndex={setOpenIndex}
										onActivate={() => {
											setUniqueId(survey?.id ?? "");
											setSelectedSurvey(survey);
											setActivateOpen(true);
										}}
										onSuspend={() => {
											setUniqueId(survey?.id ?? "");
											setSelectedSurvey(survey);
											setSuspendOpen(true);
										}}
									/>

								</div>

								<div className="flex text-[#494949] text-[14px] mt-5 ">
									{survey.surveyDescription?.length > 200
										? survey.surveyDescription.slice(0, 150) + "..."
										: survey.surveyDescription}
								</div>


								<div className="flex justify-between mt-5 items-center mb-5">
									<h6 className="flex justify-between items-center text-[#494949] text-[12px] ">
										<Calendar size={12} />
										{formatDate(survey?.createdAt ?? '')}
									</h6>
									<p className={`text-xs ${survey?.isActive ? 'bg-blue-50 border border-blue-600 text-blue-600 rounded-full px-3 py-[2px]' :
										'bg-red-50 border border-red-600 text-red-500 rounded-full px-3 py-[2px]'} `}>
										{survey?.isActive ? 'Active' : 'Inactive'}
									</p>
								</div>

								<div
									className="flex w-full justify-center border-t border-gray-100 mt-auto"
									onClick={(e) => e.stopPropagation()}
								>
									<DataPointActions
										survey={survey}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/*  pagination */}
			{pagination && data.length > 0 && (
				<Pagination
					currentPage={pagination.page}
					totalPages={pagination.pages}
					limit={pagination.limit}
					onPageChange={(newPage) => {
						setPage(newPage);
						onPageChange(newPage);
					}}
					onLimitChange={(newLimit) => {
						setLimit(newLimit);
						setPage(1);
						onLimitChange(newLimit);
					}}
				/>
			)}

			{
				activateOpen && selectedSurvey && (
					<SurveyStatus uniqueId={uniqueId} survey={selectedSurvey} setOpen={setActivateOpen} activate={true} suspend={false} />
				)
			}

			{
				suspendOpen && selectedSurvey && (
					<SurveyStatus uniqueId={uniqueId} survey={selectedSurvey} setOpen={setSuspendOpen} activate={false} suspend={true} />
				)
			}

		</div>
	);
};

export default SurveyTable;
