import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/api/apiClient";
import ProfileHeader from "@/components/profile/ProfileHeader";
import OrderHistory from "@/components/profile/OrderHistory";
import SalesHistory from "@/components/profile/SalesHistory";

export default function Profile() {
  const { user, isLoadingAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (isLoadingAuth) return;
      if (!user?.id) {
        setLoading(false);
        setError("Please log in to view your profile.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const profileRes = await api.get(`/profiles/ensure/${user.id}`);
        if (!mounted) return;
        const profileData = profileRes.data || profileRes;
        setProfile(profileData);

        const ordersRes = await api.get(`/profiles/${user.id}/orders`);
        if (!mounted) return;
        setOrders(ordersRes.data || []);

        const salesRes = await api.get(`/profiles/${user.id}/sales`);
        if (!mounted) return;
        setSales(salesRes.data || null);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user?.id, isLoadingAuth]);

  if (isLoadingAuth || loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-6">
      <ProfileHeader profile={profile} />

      <section>
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        <OrderHistory orders={orders} />
      </section>

      {sales && (
        <section>
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <SalesHistory sales={sales} />
        </section>
      )}
    </div>
  );
}
