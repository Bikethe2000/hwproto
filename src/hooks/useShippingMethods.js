import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function useShippingMethods() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "shipping_methods"), (snap) => {
      setMethods(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return methods;
}
