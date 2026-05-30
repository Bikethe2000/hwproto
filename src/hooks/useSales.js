import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function useSales(uid) {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "sales"), where("sellerId", "==", uid));

    return onSnapshot(q, (snap) => {
      setSales(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [uid]);

  return sales;
}
