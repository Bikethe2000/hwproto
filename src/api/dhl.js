export default async function handler(req, res) {
  const { country, weightKg } = req.body;

  try {
    const response = await fetch("https://api.dhl.com/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DHL-API-Key": process.env.DHL_API_KEY,
      },
      body: JSON.stringify({
        plannedShippingDate: new Date().toISOString().split("T")[0],
        unitOfMeasurement: "metric",
        packages: [{ weight: weightKg }],
        shipperCountryCode: "GR",
        receiverCountryCode: country,
      }),
    });

    const data = await response.json();

    // Extract price from DHL response
    const price = data?.products?.[0]?.totalPrice || null;

    res.status(200).json({
      ok: true,
      price,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: true });
  }
}
