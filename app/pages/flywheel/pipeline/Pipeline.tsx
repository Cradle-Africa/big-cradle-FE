import { Pipeline } from "@/app/lib/type";
import { Calendar, Eye, LetterText } from "lucide-react";

const PipelinePage = ({ data }: { data: Pipeline[] }) => {
	return (
		<div className="grid grid-cols-2 lg:grid lg:grid-cols-2 gap-5 mt-10">
			{
				data.map((pipeline, index) =>
					<div key={index} className="border border-gray-200 rounded-lg px-6 py-6">
						<div className="flex items-center ">
							<LetterText size={16} className="text-[#0C0C0C]" />
							<h2 className="ml-2 text-[18px] text-[#0C0C0C]">
								{pipeline.pipelineName}
							</h2>
						</div>
						<p className="text-[#494949] text-[14px] mt-5">
							{pipeline.pipelineDescription}
						</p>
						<div className="flex w-full justify-end mt-5 border-b border-gray-100 pb-3">
							<div className="flex items-center ">
								<Calendar size={12} />
								<h6 className="ml-1 text-[#494949] text-[12px]">10/09/2031</h6>
							</div>
						</div>
						<div className="flex justify-end mt-5">
							<button
								className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
							>
								<div className="flex fgap2 items-center gap-2">
									<Eye size={18} color="white" />
									<span className="text-white">View Data Point</span>
								</div>
							</button>
						</div>
					</div>)
			}



		</div >

	);
};

export default PipelinePage;

