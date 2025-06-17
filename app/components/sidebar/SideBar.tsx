import { User } from "@/app/pages/user/types/User";
import { getUser } from "@/app/utils/user/userData";
import BusinessSideBar from "./BusinessSideBar";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useEffect, useState } from "react";
import LoadingSidebar from "./LoadingSideBar";

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
  }

  return <LoadingSidebar />;
};

export default SideBar;
