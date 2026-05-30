import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { useSales } from "@/hooks/useSales";
// import { useWasteListings } from "@/hooks/useWasteListings";

import ProfileHeader from "@/components/profile/ProfileHeader";
import OrderHistory from "@/components/profile/OrderHistory";
import SalesHistory from "@/components/profile/SalesHistory";
// import WasteListings from "@/components/profile/WasteListings";

export default function Profile() {
  const profile = useUserProfile();
  const orders = useOrderHistory(profile?.uid);
  const sales = useSales(profile?.uid);
//   const listings = useWasteListings(profile?.uid);

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-12 p-6">
      <ProfileHeader profile={profile} />

      <section>
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        <OrderHistory orders={orders} />
      </section>

      {profile.isSeller && (
        <>
          <section>
            <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
            <SalesHistory sales={sales} />
          </section>
{/* 
          <section>
            <h2 className="text-xl font-bold mb-4">Waste Listings</h2>
            <WasteListings listings={listings} />
          </section> */}
        </>
      )}
    </div>
  );
}
