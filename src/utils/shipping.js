export function calculateShipping(method, weight, isRemote) {
  let cost = method.basePrice + (weight / 1000) * method.pricePerKg;

  if (isRemote && method.remoteSurcharge) {
    cost += method.remoteSurcharge;
  }

  return {
    id: method.id,
    name: method.name,
    cost: parseFloat(cost.toFixed(2)),
    eta: `${method.etaMin}-${method.etaMax} days`
  };
}

export function getBestShipping(methods, zone, weight, isRemote) {
  const available = methods.filter(
    (m) =>
      m.zone === zone &&
      weight >= m.minWeight &&
      weight <= m.maxWeight &&
      m.isActive
  );

  const priced = available.map((m) =>
    calculateShipping(m, weight, isRemote)
  );

  priced.sort((a, b) => a.cost - b.cost);

  return priced[0] || null;
}
