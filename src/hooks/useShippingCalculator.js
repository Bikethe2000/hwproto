import { useMemo } from "react";
import { calculateShipping, getBestShipping } from "@/utils/shipping";

export function useShippingCalculator(methods, zone, weight, isRemote) {
  return useMemo(() => {
    if (!methods.length || !zone) return { best: null, all: [] };

    const all = methods
      .filter(
        (m) =>
          m.zone === zone &&
          weight >= m.minWeight &&
          weight <= m.maxWeight &&
          m.isActive
      )
      .map((m) => calculateShipping(m, weight, isRemote));

    const best = getBestShipping(methods, zone, weight, isRemote);

    return { best, all };
  }, [methods, zone, weight, isRemote]);
}
