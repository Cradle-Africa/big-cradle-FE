import { User } from "@/app/pages/user/types/User";
import { getUser } from "@/app/utils/user/userData";
import BusinessSideBar from "./BusinessSideBar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useEffect, useState } from "react";
import LoadingSidebar from "./LoadingSideBar";
import AdminSidebar from "./AdminSidebar";
import EmployeeSidebar from "./EmployeeSidebar";

const SideBar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = getUser(); // make sure this returns a promise if async
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  if (user?.role === "business") {
    return <BusinessSideBar />;
  } else if (user?.role === "super admin") {
    return <SuperAdminSidebar />;
  } else if (user?.role === "admin") {
    return <AdminSidebar />;
  } else if (user?.role === "employee") {
    return <EmployeeSidebar />;
  }
  
  

  return <LoadingSidebar />;
};

export default SideBar;
