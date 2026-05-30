import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function useOrderHistory(uid) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, "orders"), where("userId", "==", uid));

    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [uid]);

  return orders;
}
