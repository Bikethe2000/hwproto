import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function useWasteListings(uid) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "waste_listings"), where("sellerId", "==", uid));

    return onSnapshot(q, (snap) => {
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [uid]);

  return listings;
}
