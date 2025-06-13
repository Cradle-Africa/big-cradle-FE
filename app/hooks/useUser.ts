import { useEffect, useState } from "react";
import { User } from "../types/User"; 
import { getUser } from "../utils/user/userData"; 

export const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  return user;
};
