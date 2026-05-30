import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for your purchase. Your order is being processed.
      </p>
      <Link
        to="/store"
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
