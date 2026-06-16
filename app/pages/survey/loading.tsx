import DashboardLayout from "@/app/DashboardLayout";
import SurveySkeleton from "./skeleton/SurveySkeleton";

const SurveyPageLoading = () => {
  return (
    <DashboardLayout>
      <div>
        <SurveySkeleton/>
      </div>
    </DashboardLayout>
  );
};

export default SurveyPageLoading;
