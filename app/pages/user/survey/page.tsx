import DashboardLayout from "@/app/DashboardLayout";
import { Plus } from "lucide-react";
import Card from "./_components/SurveyCard";
import { statuses } from "./_components/SurveyStatus";
import SurveyStatus from "@/app/pages/user/survey/_components/SurveyStatus";
import SurveyTable from "./_components/SurveyTable";

const SurveyCard = () => {
  return (
    <DashboardLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-black">Surveys</p>
          <p>
            View, manage, and track your survey tasks. Create new surveys to
            collect insights in real time
          </p>
        </div>
        <button className="bg-[#3352FF] rounded-[8px] px-4 h-[36px]">
          <div className="flex fgap2 items-center gap-2">
            <Plus size={18} color="white" />
            <span className="text-white">Create new survey</span>
          </div>
        </button>
      </div>
      {/* Build the cards area */}
      <div className="flex gap-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <Card key={`${index}`} isHighLighted={index === 0} />
        ))}
      </div>

      {/* Survey table  */}
      <div className="flex flex-col bg-white p-4 mt-8">
        <p className="font-bold text-black">Survey Table List</p>
        <div className="flex gap-4 my-4">
          {statuses.map((status) => (
            <SurveyStatus
              key={status}
              isSelected={status === "All"}
              status={status}
            />
          ))}
        </div>
        <SurveyTable />

      </div>
      
    </DashboardLayout>
  );
};

export default SurveyCard;
