// components/CheckoutButton.jsx
import React from "react";
import { apiFetch } from "@/api/apiClient";

export default function CheckoutButton({ cartItems }) {
  const handleCheckout = async () => {
    try {
      // Convert cart items to the format your backend expects
      const items = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await apiFetch("/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.url) {
        console.error("Stripe session creation failed:", response);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = response.url;
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition"
    >
      Checkout
    </button>
  );
}
