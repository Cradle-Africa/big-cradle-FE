import DashboardLayout from "@/app/DashboardLayout";
import { Spinner } from "@radix-ui/themes";

const EmployeeLoading = () => {
   return (
      <DashboardLayout>
        <div>
          <p> <Spinner/></p>
        </div>
      </DashboardLayout>
    );
}

export default EmployeeLoading
