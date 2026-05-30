import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/api/apiClient";

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Fetch full profile from backend
    api.entities.User.get(user.id)
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, [isAuthenticated, user]);

  return profile;
}
