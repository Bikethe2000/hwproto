import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function useUserProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setProfile(null);
        return;
      }

      const ref = doc(db, "users", user.uid);

      return onSnapshot(ref, (snap) => {
        setProfile({ uid: user.uid, ...snap.data() });
      });
    });

    return () => unsub();
  }, []);

  return profile;
}
