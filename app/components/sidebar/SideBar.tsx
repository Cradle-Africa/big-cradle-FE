import { User } from "@/app/pages/user/types/User";
import { getUser } from "@/app/utils/user/userData";
import BusinessSideBar from "./BusinessSideBar";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SideBar = () => {
  const user: User | null = getUser();

  if (user?.role === "business") {
    return <BusinessSideBar />;
  }
  // else if(user?.role === "admin"){
  //     return <BusinessSideBar/>
  // }
  // else if(user?.role === "super admin"){
  //     return <BusinessSideBar/>
  // }
  return <SuperAdminSidebar />;
};

export default SideBar;
