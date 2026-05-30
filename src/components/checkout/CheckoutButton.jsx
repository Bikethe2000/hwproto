import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutButton({ cartItems }) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();
    stripe.redirectToCheckout({ sessionId: data.sessionId });
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
    >
      Checkout
    </button>
  );
}
