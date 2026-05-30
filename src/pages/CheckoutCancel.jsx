import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-6">
        Your payment was cancelled. You can try again anytime.
      </p>
      <Link
        to="/cart"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
      >
        Return to Cart
      </Link>
    </div>
  );
}
