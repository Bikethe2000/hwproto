import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Mail, Package, TrendingUp, Edit2, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SiteLayout from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from '@/components/profile/ProfileHeader';
import OrderHistory from '@/components/profile/OrderHistory';
import SalesHistory from '@/components/profile/SalesHistory';
import WasteListings from '@/components/profile/WasteListings';

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState(null);
  const [wasteListings, setWasteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile
      const profileRes = await api.get(`/profiles/${userId}`);
      setProfile(profileRes.data);

      // Fetch orders
      const ordersRes = await api.get(`/profiles/${userId}/orders`);
      setOrders(ordersRes.data || []);

      // Fetch sales history
      const salesRes = await api.get(`/profiles/${userId}/sales`);
      setSales(salesRes.data);

      // Fetch waste listings
      const wasteRes = await api.get(`/waste/by-seller/${userId}`);
      setWasteListings(wasteRes.data || []);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">{error || 'Profile not found'}</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white overflow-hidden">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>

                {/* Profile Info */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.displayName}</h1>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.country && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {profile.country}
                          {profile.region && ` • ${profile.region}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => logout()}
                      className="gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs font-mono-code text-muted-foreground mb-1">PURCHASES</p>
                <p className="text-2xl font-bold">{profile.totalPurchases || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-xs font-mono-code text-muted-foreground mb-1">SPENT</p>
                <p className="text-2xl font-bold">€{(profile.totalSpent || 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">All Time</p>
              </div>

              {sales && (
                <>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs font-mono-code text-muted-foreground mb-1">SALES</p>
                    <p className="text-2xl font-bold">{sales.totalSales || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Items Sold</p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs font-mono-code text-muted-foreground mb-1">EARNINGS</p>
                    <p className="text-2xl font-bold">€{(sales.totalEarnings || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">From Sales</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Edit Profile Modal - would go here */}
          {isEditing && isOwnProfile && (
            <div className="mb-8">
              {/* Placeholder for edit profile form */}
            </div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                {sales && <TabsTrigger value="sales">Sales</TabsTrigger>}
                {wasteListings.length > 0 && (
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Recent Orders
                    </h3>
                    {orders.length === 0 ? (
                      <p className="text-muted-foreground">No orders yet</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-mono-code text-xs text-muted-foreground">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm">€{order.total.toFixed(2)}</p>
                            </div>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* About */}
                  {profile.bio && (
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4">About</h3>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <OrderHistory orders={orders} />
              </TabsContent>

              {/* Sales Tab */}
              {sales && (
                <TabsContent value="sales">
                  <SalesHistory sales={sales} />
                </TabsContent>
              )}

              {/* Listings Tab */}
              {wasteListings.length > 0 && (
                <TabsContent value="listings">
                  <WasteListings listings={wasteListings} />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
      </div>
    </div>
  );
}
