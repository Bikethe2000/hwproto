# E-Commerce System Implementation Guide

## 🎉 Welcome!

This document provides a comprehensive guide to the newly implemented e-commerce system for hwproto. The system includes a complete shopping cart, product management, order tracking, user profiles, and a 3D printer waste marketplace.

## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [System Architecture](#system-architecture)
3. [Frontend Components](#frontend-components)
4. [Backend API](#backend-api)
5. [User Workflows](#user-workflows)
6. [Developer Guide](#developer-guide)
7. [Configuration](#configuration)
8. [Testing](#testing)

---

## ✨ Features Overview

### 1. Shopping Cart System
- **Real-time Updates**: Cart updates without page refresh
- **Persistence**: Cart data saved to localStorage and synced with database
- **Auto-sync**: Automatic synchronization every 30 seconds
- **Multiple Items**: Add/remove products with quantity management
- **Variant Support**: Handle product variants (colors, sizes, etc.)
- **Cart Expiration**: Carts expire after 30 days

### 2. Product Detail Pages
- **Full Information**: Title, description, images, price, stock status
- **Image Gallery**: Multiple images with zoom capability
- **Navigation**: Next/previous product buttons
- **Add to Cart**: Direct add to cart from detail view
- **Buy Now**: Quick checkout button
- **Related Products**: See similar items
- **Responsive Design**: Works on all devices

### 3. Shipping & Logistics
- **Automatic Carrier Selection**: Chooses best option based on location
- **Multiple Carriers**:
  - BoxNow (Greece only, fast delivery)
  - ELTA Courier (Greece & EU)
  - DHL (International)
- **Weight-based Pricing**: Automatic cost calculation
- **Remote Area Surcharges**: Additional fees for remote locations
- **Estimated Delivery Times**: Real-time estimates
- **Country Selection**: Full country support

### 4. Checkout Flow
- **Multi-step Process**: Shipping → Payment → Review
- **Address Validation**: Full address capture
- **Shipping Options**: Compare methods and prices
- **Payment Methods**:
  - Credit/Debit Card (Stripe)
  - Bank Transfer
- **Order Confirmation**: Immediate confirmation and email
- **Order Tracking**: Real-time status updates

### 5. User Profiles
- **Personal Information**: Display name, email, location
- **Profile Picture**: Avatar support
- **Purchase History**: View all past orders
- **Sales History**: Track waste marketplace sales
- **Order Statistics**: Total purchases, spending
- **Seller Information**: Ratings, reviews, earnings
- **Edit Profile**: Update personal information

### 6. Order Management
- **Order History**: View all orders with details
- **Order Status**: Track pending → shipped → delivered
- **Cancellation**: Cancel orders before shipping
- **Tracking Numbers**: DHL, BoxNow, ELTA tracking
- **Estimated Delivery**: Date projections
- **Email Notifications**: Automatic confirmations

### 7. 3D Printer Waste Marketplace
- **Listings**: Sell 3D printing waste materials
- **Material Types**: PLA, ABS, PETG, TPU, Nylon, Other
- **Conditions**: Pristine, Good, Fair, Scrap
- **Filtering**: By material, condition, price
- **Search**: Full text search capability
- **Seller Ratings**: Community ratings and reviews
- **Bulk Discounts**: Structure in place for discounts
- **Purchase Integration**: Add waste to cart like normal products

### 8. Payment Integration (Foundations)
- **Stripe Ready**: Full integration scaffolding
- **Payment Intent Creation**: Backend support
- **Webhook Handling**: Event processing
- **Refund Support**: Return processing
- **PCI Compliance**: Secure payment handling
- **Test Mode**: Stripe test environment ready

---

## 🏗️ System Architecture

### Frontend Stack
```
React + TypeScript/JSX
├── State Management
│   ├── CartContext (real-time cart)
│   ├── AuthContext (user authentication)
│   └── React Query (API data)
├── UI Framework
│   ├── shadcn/ui (components)
│   ├── Tailwind CSS (styling)
│   ├── Framer Motion (animations)
│   └── Radix UI (accessibility)
└── Routing
    └── React Router (pages & navigation)
```

### Backend Stack
```
Express.js
├── Routes (6 new endpoints)
│   ├── /api/cart
│   ├── /api/orders
│   ├── /api/profiles
│   ├── /api/waste
│   ├── /api/shipping
│   └── /api/payments
├── Middleware
│   └── Authentication & Authorization
├── Database
│   ├── Firebase Firestore (production)
│   └── Local JSON (development)
└── Services
    ├── Cart Service
    ├── Order Service
    ├── User Profile Service
    └── Payment Service
```

---

## 🎨 Frontend Components

### Page Components

#### ProductDetail (`src/pages/ProductDetail.jsx`)
Displays full product information with gallery and shopping options.
```
GET /product/:productId → Full detail page
Features:
- Image gallery with zoom
- Stock status indicator
- Related products
- Next/previous navigation
```

#### CartPage (`src/pages/CartPage.jsx`)
Shopping cart display and management.
```
GET /cart → View cart
Features:
- Item listing with images
- Quantity management
- Real-time totals
- Continue shopping button
```

#### Checkout (`src/pages/Checkout.jsx`)
Multi-step checkout process.
```
GET /checkout → Checkout form
POST /orders → Create order
Features:
- Address entry
- Shipping method selection
- Payment method selection
- Order review & confirmation
```

#### UserProfile (`src/pages/UserProfile.jsx`)
User profile and order history.
```
GET /profile/:userId → User profile
Features:
- Profile information
- Order history
- Sales history
- Waste listings
- Stats overview
```

#### WasteMarketplace (`src/pages/WasteMarketplace.jsx`)
3D printer waste marketplace.
```
GET /waste → Listings
Features:
- Search & filtering
- Material type selection
- Condition filtering
- Price range filtering
- Seller ratings
```

### UI Components

#### Cart Components
- **AddToCartButton**: Reusable add-to-cart button with feedback
- **CartItem**: Individual cart item display
- **CartSummary**: Price breakdown and checkout button

#### Profile Components
- **OrderHistory**: Past orders listing
- **SalesHistory**: Seller statistics
- **WasteListings**: User's marketplace listings

---

## 🔌 Backend API

### Cart Endpoints

```javascript
// Get user's cart
GET /api/cart/:userId
// Response: { id, items: [], subtotal, shippingCost, total, ... }

// Add item to cart
POST /api/cart/add
// Body: { productId, quantity, priceAtTime, variant? }
// Response: Updated cart

// Remove item
DELETE /api/cart/:cartId/items/:itemId
// Response: Updated cart

// Update quantity
PATCH /api/cart/:cartId/items/:itemId
// Body: { quantity }
// Response: Updated cart

// Apply shipping
POST /api/cart/:cartId/apply-shipping
// Body: { shippingMethod, shippingCost }
// Response: Updated cart

// Clear cart
DELETE /api/cart/:cartId
// Response: { success: true }

// Sync cart
POST /api/cart/sync
// Body: { cartData }
// Response: Synced cart
```

### Order Endpoints

```javascript
// Create order
POST /api/orders
// Body: { items, shippingAddress, shippingMethod, total, notes? }
// Response: New order

// Get user's orders
GET /api/orders/user/:userId
// Response: [ orders... ]

// Get single order
GET /api/orders/:orderId
// Response: Order details

// Update status (admin)
PATCH /api/orders/:orderId/status
// Body: { status, trackingNumber? }
// Response: Updated order

// Cancel order
POST /api/orders/:orderId/cancel
// Response: Cancelled order
```

### Profile Endpoints

```javascript
// Get profile
GET /api/profiles/:userId
// Response: Profile data

// Update profile
PATCH /api/profiles/:userId
// Body: { displayName, bio, profilePicture, country, region }
// Response: Updated profile

// Get orders
GET /api/profiles/:userId/orders
// Response: [ orders... ]

// Get sales
GET /api/profiles/:userId/sales
// Response: { totalSales, totalEarnings, sellerRating, reviews }

// Ensure profile exists
POST /api/profiles/ensure/:userId
// Response: Profile (creates if doesn't exist)
```

### Waste Marketplace Endpoints

```javascript
// List listings
GET /api/waste/listings?materialType=PLA&condition=good&minPrice=1&maxPrice=10&search=white
// Response: [ listings... ]

// Get single listing
GET /api/waste/listings/:listingId
// Response: Listing details

// Create listing (auth required)
POST /api/waste/listings
// Body: { materialType, weight, condition, pricePerKg, images, description, color, quantity }
// Response: New listing

// Update listing (auth + owner)
PATCH /api/waste/listings/:listingId
// Body: { materialType, weight, condition, pricePerKg, ... }
// Response: Updated listing

// Delete listing (auth + owner)
DELETE /api/waste/listings/:listingId
// Response: { success: true }

// Get seller's listings
GET /api/waste/by-seller/:sellerId
// Response: [ listings... ]

// Purchase waste
POST /api/waste/listings/:listingId/purchase
// Body: { quantity }
// Response: Updated listing
```

### Shipping Endpoints

```javascript
// Get methods
GET /api/shipping/methods?country=GR&weight=2&region=Athens&isRemoteArea=false
// Response: [ { id, name, cost, estimatedDays, ... } ]

// Calculate cost
GET /api/shipping/calculate?country=GR&weight=2&shippingMethodId=boxnow-greece
// Response: [ { id, name, cost, estimatedDelivery, ... } ]

// Estimate delivery
POST /api/shipping/estimate
// Body: { country, weight, shippingMethodId }
// Response: { estimatedDays, estimatedDelivery, method }
```

### Payment Endpoints

```javascript
// Create intent
POST /api/payments/create-intent
// Body: { amount, currency, orderId, metadata }
// Response: { clientSecret, paymentIntentId }

// Confirm payment
POST /api/payments/confirm
// Body: { paymentIntentId, paymentMethodId }
// Response: { status, paymentIntentId }

// Get methods
GET /api/payments/methods
// Response: { data: [ paymentMethods... ] }

// Process refund
POST /api/payments/refund
// Body: { paymentIntentId, amount, reason }
// Response: Refund details

// Webhook
POST /api/payments/webhook
// Body: Stripe event
// Response: { received: true }
```

---

## 👥 User Workflows

### Customer: Browse & Purchase

1. **Browse Products**
   - Visit `/store`
   - Click product to see `/product/:id`
   - View images, description, price

2. **Add to Cart**
   - Click "Add to Cart" button
   - Quantity is updated in context
   - Cart icon updates in navbar

3. **View Cart**
   - Go to `/cart`
   - See items, quantities, subtotal
   - Adjust quantities or remove items
   - Click "Proceed to Checkout"

4. **Checkout**
   - Go to `/checkout`
   - Enter shipping address
   - Select shipping method
   - Choose payment method
   - Review order
   - Place order

5. **Order Confirmation**
   - Receive confirmation page
   - Email sent with order details
   - Can view in `/profile/:userId`

6. **Track Order**
   - Go to `/profile/:userId`
   - Click on order
   - See status and tracking info
   - Receive updates via email

### Seller: List & Sell Waste

1. **Create Listing**
   - Click "Create Listing" on `/waste`
   - Fill in material type
   - Set weight and condition
   - Upload images
   - Set price per kg
   - Publish

2. **View Sales**
   - Go to `/profile/:userId`
   - Click "Sales" tab
   - See total sales, earnings
   - View buyer reviews

3. **Manage Listings**
   - Go to `/profile/:userId`
   - Click "Listings" tab
   - Edit or delete listings
   - Track views and sold items

---

## 👨‍💻 Developer Guide

### Adding to Cart from Anywhere

```javascript
import { useAddToCart } from '@/hooks/useCart';

export function MyComponent() {
  const addToCart = useAddToCart();
  
  const handleAdd = () => {
    addToCart(product, quantity);
  };
  
  return <button onClick={handleAdd}>Add to Cart</button>;
}
```

### Accessing Cart Data

```javascript
import { useCart } from '@/hooks/useCart';

export function MyComponent() {
  const { 
    items, 
    itemCount, 
    subtotal, 
    total,
    addToCart,
    removeFromCart,
    updateQuantity 
  } = useCart();
  
  return <div>Items: {itemCount}, Total: €{total.toFixed(2)}</div>;
}
```

### Creating an Order

```javascript
// Frontend
const orderData = {
  items: cart.items,
  shippingAddress: {...},
  shippingMethod: 'BoxNow',
  shippingCost: 3.50,
  total: 103.50
};

const response = await api.post('/orders', orderData);
const orderId = response.data.id;
```

### Calculating Shipping

```javascript
const params = new URLSearchParams({
  country: 'GR',
  weight: 2.5,
  region: 'Athens'
});

const response = await fetch(`/api/shipping/calculate?${params}`);
const methods = response.json().data;
// [
//   { id: 'boxnow-greece', name: 'BoxNow', cost: 2.50, estimatedDays: 1 },
//   { id: 'elta-greece', name: 'ELTA', cost: 4.00, estimatedDays: 2 }
// ]
```

### Getting User Profile

```javascript
const profile = await api.get(`/profiles/${userId}`);
console.log(profile.data);
// { displayName, email, country, totalPurchases, totalSpent, ... }
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` in server directory:

```env
# JWT
JWT_SECRET=your_secret_key_here

# Stripe (for real integration)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=4000
NODE_ENV=development

# Email (if using)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Create `.env` in root directory:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Cart Configuration

Edit `src/contexts/CartContext.jsx`:

```javascript
const STORAGE_KEY = 'hwproto_cart'; // localStorage key
const SYNC_INTERVAL = 30000; // Sync every 30 seconds
```

### Shipping Configuration

Edit `src/server/routes/shipping.js`:

```javascript
const DEFAULT_SHIPPING_RULES = [
  {
    id: 'custom-carrier',
    name: 'Custom Shipping',
    carrier: 'YourCarrier',
    baseCost: 10.00,
    // ...
  }
];
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Cart Functionality
- [ ] Add product to cart
- [ ] Remove product from cart
- [ ] Update quantity
- [ ] Cart persists after page reload
- [ ] Cart syncs with database
- [ ] Real-time updates work

#### Checkout Flow
- [ ] Address validation
- [ ] Shipping methods load
- [ ] Shipping cost updates
- [ ] Payment method selection
- [ ] Order creation succeeds
- [ ] Order appears in history

#### Product Detail
- [ ] Images load correctly
- [ ] Next/previous navigation works
- [ ] Related products display
- [ ] Add to cart from detail
- [ ] Stock status displays

#### User Profile
- [ ] Profile loads correctly
- [ ] Order history displays
- [ ] Sales history shows (for sellers)
- [ ] Stats are accurate
- [ ] Profile edit saves

#### Waste Marketplace
- [ ] Listings load with images
- [ ] Filtering works
- [ ] Search works
- [ ] Add to cart works
- [ ] Create listing works (auth)

### API Testing

Use Postman or curl:

```bash
# Create cart item
curl -X POST http://localhost:4000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-123",
    "quantity": 1,
    "priceAtTime": 50.00
  }'

# Get shipping methods
curl http://localhost:4000/api/shipping/calculate?country=GR&weight=2

# Create order
curl -X POST http://localhost:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shippingAddress": {...},
    "total": 100.00
  }'
```

---

## 📚 Additional Resources

### File Structure

```
src/
├── pages/
│   ├── ProductDetail.jsx
│   ├── CartPage.jsx
│   ├── Checkout.jsx
│   ├── UserProfile.jsx
│   └── WasteMarketplace.jsx
│
├── components/
│   ├── cart/
│   │   ├── AddToCartButton.jsx
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   ├── profile/
│   │   ├── OrderHistory.jsx
│   │   ├── SalesHistory.jsx
│   │   └── WasteListings.jsx
│
├── contexts/
│   └── CartContext.jsx
│
├── hooks/
│   └── useCart.js

server/
├── routes/
│   ├── cart.js
│   ├── orders.js
│   ├── profiles.js
│   ├── waste.js
│   ├── shipping.js
│   └── payments.js
├── middleware/
│   └── auth.js
```

### Database Schema

See `/.github/ECOMMERCE_IMPLEMENTATION_PLAN.md` for full schema details.

---

## 🚀 Next Steps

1. **Connect Stripe**: Implement real payment processing
2. **Email Notifications**: Set up automatic order confirmations
3. **Admin Dashboard**: Order management interface
4. **Product Images**: Optimize image handling
5. **Performance**: Implement caching and optimization
6. **Testing**: Add comprehensive test suites

---

## 💬 Support

For issues or questions:
1. Check `/github/IMPLEMENTATION_PROGRESS.md`
2. Review API response formats
3. Check browser console for errors
4. Verify authentication tokens
5. Check database connection

---

## 📄 License

This e-commerce system is part of the hwproto platform.

---

**Last Updated**: May 30, 2026
**Version**: 1.0.0
