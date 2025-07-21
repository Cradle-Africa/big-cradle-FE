import DashboardLayout from "@/app/DashboardLayout";
import { Spinner } from "@radix-ui/themes";

const SurveyPageLoading = () => {
  return (
    <DashboardLayout>
      <div>
        <Spinner/>
      </div>
    </DashboardLayout>
  );
};

export default SurveyPageLoading;
