import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";

export default function CheckoutCancel() {
  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Your payment was cancelled. Nothing has been charged, and your cart is still waiting for you.
        </p>
        <Link to="/cart" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80">
          Return to Cart
        </Link>
      </div>
    </SiteLayout>
  );
}
