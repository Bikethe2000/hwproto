# E-Commerce System Implementation Plan

## Overview
This document outlines the comprehensive implementation of an e-commerce platform including shopping cart, order management, user profiles, 3D printer waste marketplace, and Stripe payment integration.

## System Architecture

### Frontend Stack
- **Framework**: React + TypeScript/JSX
- **State Management**: React Context + custom hooks
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Animation**: Framer Motion
- **Data Fetching**: TanStack React Query
- **Storage**: localStorage + Database sync

### Backend Stack
- **Server**: Express.js
- **Database**: Firestore (with local fallback)
- **Authentication**: JWT-based auth
- **Payment**: Stripe (foundations)

---

## Phase 1: Core Infrastructure

### 1.1 Database Schema Extensions

#### Collections to Create:
- **carts** - User shopping carts
- **orders** - Order history
- **waste_listings** - 3D printer waste marketplace
- **user_profiles** - Enhanced user data
- **shipping_rules** - Shipping cost calculations

#### Schema Details:

```javascript
// Carts collection
{
  id: string (UUID),
  userId: string,
  items: [
    {
      productId: string,
      quantity: number,
      priceAtTime: number,
      addedAt: timestamp,
      selectedVariant?: { material, weight, etc }
    }
  ],
  subtotal: number,
  shippingCost: number,
  shippingMethod: string,
  taxAmount: number,
  total: number,
  lastUpdated: timestamp,
  expiresAt: timestamp (30 days)
}

// Orders collection
{
  id: string (UUID),
  userId: string,
  items: [{ productId, quantity, priceAtTime, variantData }],
  subtotal: number,
  shippingCost: number,
  shippingMethod: string,
  shippingAddress: { country, region, postalCode, etc },
  taxAmount: number,
  total: number,
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'unpaid' | 'processing' | 'completed' | 'failed' | 'refunded',
  stripePaymentIntentId?: string,
  estimatedDelivery: date,
  createdAt: timestamp,
  updatedAt: timestamp,
  notes: string,
  trackingNumber?: string
}

// Waste listings collection
{
  id: string (UUID),
  sellerId: string,
  sellerInfo: { name, avatar, rating },
  materialType: 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'Nylon' | 'Other',
  weight: { value: number, unit: 'g' | 'kg' },
  condition: 'pristine' | 'good' | 'fair' | 'scrap',
  pricePerKg: number,
  totalPrice: number,
  images: [string],
  description: string,
  available: boolean,
  quantity: number,
  color?: string,
  specifications?: object,
  createdAt: timestamp,
  updatedAt: timestamp,
  viewCount: number,
  soldCount: number
}

// User profiles collection
{
  id: string (userId),
  displayName: string,
  email: string,
  profilePicture?: string,
  bio?: string,
  country: string,
  region?: string,
  
  // Purchase data
  totalPurchases: number,
  totalSpent: number,
  orderHistory: [orderId],
  
  // Sales data (if user is a seller)
  totalSales: number,
  totalEarnings: number,
  wasteListings: [listingId],
  sellerRating: number,
  sellerReviews: [{ rating, comment, buyerName, date }],
  
  // Wallet (future)
  walletBalance: number,
  
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}

// Shipping rules collection
{
  id: string,
  name: string,
  carrier: 'BoxNow' | 'ELTA' | 'DHL',
  applicableCountries: [string],
  applicableRegions?: [string],
  maxWeight: number (kg),
  minWeight?: number,
  costPerKg?: number,
  baseCost: number,
  remoteAreaSurcharge?: number,
  estimatedDays: number,
  priority: number
}
```

### 1.2 Backend Routes to Create

Create `/server/routes/cart.js`:
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update item quantity
- `DELETE /api/cart/:cartId/items/:itemId` - Remove item
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:cartId/apply-shipping` - Calculate shipping
- `DELETE /api/cart/:cartId` - Clear cart

Create `/server/routes/orders.js`:
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/cancel` - Cancel order

Create `/server/routes/waste.js`:
- `GET /api/waste/listings` - List all waste
- `POST /api/waste/listings` - Create new listing
- `PATCH /api/waste/listings/:id` - Update listing
- `DELETE /api/waste/listings/:id` - Delete listing
- `GET /api/waste/listings/by-seller/:sellerId` - Get seller's listings
- `POST /api/waste/listings/:id/purchase` - Purchase waste

Create `/server/routes/profiles.js`:
- `GET /api/profiles/:userId` - Get user profile
- `PATCH /api/profiles/:userId` - Update profile
- `GET /api/profiles/:userId/orders` - Get order history
- `GET /api/profiles/:userId/sales` - Get sales history

Create `/server/routes/shipping.js`:
- `GET /api/shipping/calculate` - Calculate shipping cost
- `GET /api/shipping/methods` - Get available shipping methods
- `POST /api/shipping/estimate` - Estimate delivery date

---

## Phase 2: Frontend Implementation

### 2.1 Shopping Cart System

#### Components to Create:

**`src/contexts/CartContext.jsx`** - Cart state management
```javascript
// Features:
// - Add/remove items
// - Update quantities
// - Calculate subtotal
// - Sync with localStorage
// - Persist to database
// - Real-time updates
```

**`src/hooks/useCart.js`** - Custom cart hook
```javascript
// - useCart() - main hook
// - useCartItems() - items selector
// - useCartTotal() - totals selector
// - useCartSync() - sync with DB
```

**`src/components/cart/CartSidebar.jsx`** - Side cart view
**`src/components/cart/CartPage.jsx`** - Full cart page
**`src/components/cart/CartItem.jsx`** - Individual cart item
**`src/components/cart/CartSummary.jsx`** - Price summary
**`src/components/cart/AddToCartButton.jsx`** - Add to cart button with animations

#### Features:
- ✅ Add/remove products
- ✅ Update quantities with validation
- ✅ Real-time subtotal calculation
- ✅ Local storage persistence (key: `hwproto_cart`)
- ✅ Database sync on auth state change
- ✅ Cart expiration (30 days)
- ✅ Animations with Framer Motion

### 2.2 Product Detail View

**`src/pages/ProductDetail.jsx`** or **`src/components/ProductDetailModal.jsx`**

Features:
- ✅ Full product information display
- ✅ Image gallery with zoom
- ✅ Product variants (if applicable)
- ✅ Stock status indicator
- ✅ Add to cart from detail view
- ✅ Next/previous product navigation
- ✅ Related products section
- ✅ Customer reviews (future)
- ✅ Smooth open/close animations
- ✅ Works as both modal and standalone page

Routes:
- `/product/:productId` - Standalone page
- Modal trigger from store/search

### 2.3 Shipping Integration

**`src/lib/shipping.js`** - Shipping calculation logic
```javascript
// Calculate shipping based on:
// - Destination country
// - Weight
// - Region (Greece/EU/International)
// - Remote area flag
```

**`src/components/shipping/ShippingSelector.jsx`** - Shipping method selection
**`src/hooks/useShipping.js`** - Shipping calculation hook

Features:
- ✅ Automatic carrier selection
- ✅ Display all available options
- ✅ Estimated delivery time
- ✅ Real-time cost updates
- ✅ Remote area detection
- ✅ Weight-based calculations

### 2.4 Order Management

**`src/pages/Checkout.jsx`** - Checkout flow
**`src/pages/OrderConfirmation.jsx`** - Order confirmation page
**`src/pages/OrderTracker.jsx`** - Order tracking (update existing)
**`src/components/orders/OrderList.jsx`** - User's order history
**`src/components/orders/OrderDetail.jsx`** - Order detail view

Features:
- ✅ Multi-step checkout
- ✅ Shipping address entry
- ✅ Order review
- ✅ Order creation with status tracking
- ✅ Email confirmation
- ✅ Order history listing
- ✅ Order status updates

### 2.5 User Profiles

**`src/pages/UserProfile.jsx`** - Main user profile page
**`src/components/profile/ProfileHeader.jsx`** - User info section
**`src/components/profile/OrderHistory.jsx`** - Purchase history
**`src/components/profile/SalesHistory.jsx`** - Sales history (if seller)
**`src/components/profile/WasteListings.jsx`** - User's waste listings
**`src/components/profile/EditProfile.jsx`** - Profile edit form

Features:
- ✅ Display user information
- ✅ Profile picture
- ✅ View all orders
- ✅ View all sales (if applicable)
- ✅ Edit profile information
- ✅ View waste listings
- ✅ Rating/review system (future)

### 2.6 Waste Marketplace

**`src/pages/WasteMarketplace.jsx`** - Main marketplace page
**`src/pages/WasteDetail.jsx`** - Individual listing detail
**`src/components/waste/WasteListings.jsx`** - Listings grid
**`src/components/waste/WasteFilters.jsx`** - Filter sidebar
**`src/components/waste/CreateListing.jsx`** - Seller creation form
**`src/components/waste/WasteCard.jsx`** - Individual listing card

Features:
- ✅ Browse all waste listings
- ✅ Filter by material type
- ✅ Filter by condition
- ✅ Filter by price range
- ✅ Sellers can create listings
- ✅ Add waste to cart
- ✅ Bulk buy discounts (structure)
- ✅ Seller ratings/reviews
- ✅ Search functionality

---

## Phase 3: Payment Integration

### 3.1 Stripe Setup

**`src/lib/stripe.js`** - Stripe client configuration

**`src/hooks/useStripePayment.js`** - Payment hook

**Backend**: `/server/routes/payments.js`
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks
- `GET /api/payments/methods` - Get saved payment methods
- `POST /api/payments/refund` - Process refund

Features (Foundations):
- ✅ Stripe integration setup
- ✅ Payment intent creation
- ✅ Webhook handling
- ✅ Error handling
- ✅ Receipt generation structure
- ✅ Refund handling

---

## Phase 4: Database Integration

### 4.1 Firestore Integration

Update `/server/services/` to include:
- `cartService.js`
- `orderService.js`
- `profileService.js`
- `wasteService.js`
- `shippingService.js`
- `paymentService.js`

### 4.2 Local Fallback

Maintain local JSON storage as fallback for development.

---

## Implementation Order

1. ✅ Database schema definition
2. ✅ Backend routes scaffolding
3. ✅ CartContext & hooks
4. ✅ Product detail page/modal
5. ✅ Shipping calculation logic
6. ✅ Order management system
7. ✅ User profile pages
8. ✅ Waste marketplace
9. ✅ Stripe integration
10. ✅ Full checkout flow

---

## API Response Formats

### Cart Response
```json
{
  "success": true,
  "data": {
    "id": "cart-123",
    "userId": "user-456",
    "items": [...],
    "subtotal": 100.00,
    "shippingCost": 15.00,
    "taxAmount": 0,
    "total": 115.00,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### Order Response
```json
{
  "success": true,
  "data": {
    "id": "order-789",
    "userId": "user-456",
    "status": "pending",
    "paymentStatus": "unpaid",
    "items": [...],
    "total": 115.00,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Environment Variables

Backend (.env):
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_PROJECT_ID=...
NODE_ENV=production
```

Frontend (.env):
```
VITE_API_BASE_URL=https://api.example.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Testing Checklist

- [ ] Cart add/remove/update
- [ ] Cart persistence
- [ ] Shipping calculations
- [ ] Order creation
- [ ] Order tracking
- [ ] User profile viewing/editing
- [ ] Waste listing creation/browsing
- [ ] Search and filtering
- [ ] Payment flow (Stripe test mode)
- [ ] Email confirmations
- [ ] Mobile responsiveness
- [ ] Real-time updates

---

## Future Enhancements

1. Bulk discount system for waste
2. Automated email notifications
3. Advanced search/filtering
4. Seller dashboard
5. Rating/review system
6. Wishlist functionality
7. Coupon/discount codes
8. Inventory management
9. Order notifications (SMS/push)
10. Analytics dashboard
