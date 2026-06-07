import React, { createContext, useState, useCallback, useEffect } from 'react';
import { api } from '@/api/apiClient';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [userId, setUserId] = useState(null);

  const STORAGE_KEY = 'hwproto_cart';
  const SYNC_INTERVAL = 30000; // 30 seconds

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setItems(parsed.items || []);
        setShippingMethod(parsed.shippingMethod);
        setShippingCost(parsed.shippingCost || 0);
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    const cartData = {
      items,
      shippingMethod,
      shippingCost,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
  }, [items, shippingMethod, shippingCost]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.priceAtTime * item.quantity);
  }, 0);

  const total = subtotal + shippingCost + taxAmount;

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1, variant = null) => {
    const normalizedPrice = Number(product.price ?? product.priceAtTime ?? 0);
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          productName: product.title,
          image: product.image_url || product.image || product.images?.[0] || null,
          quantity,
          priceAtTime: Number.isFinite(normalizedPrice) ? normalizedPrice : 0,
          variant,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Update shipping method and cost
  const setShipping = useCallback((method, cost) => {
    setShippingMethod(method);
    setShippingCost(cost);
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
    setShippingMethod(null);
    setShippingCost(0);
    setTaxAmount(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Sync cart with database
  const syncCartWithDatabase = useCallback(async (currentUserId) => {
    if (!currentUserId || isSyncing) return;

    setIsSyncing(true);
    try {
      const cartData = {
        items,
        shippingMethod,
        shippingCost,
        subtotal,
        total,
        taxAmount,
      };

      // This will be implemented in the backend
      await api.post('/cart/sync', { userId: currentUserId, cartData });
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [items, shippingMethod, shippingCost, subtotal, total, taxAmount, isSyncing]);

  // Load cart from database
  const loadCartFromDatabase = useCallback(async (currentUserId) => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/cart/${currentUserId}`);
      if (response.data) {
        setItems(response.data.items || []);
        setShippingMethod(response.data.shippingMethod || null);
        setShippingCost(response.data.shippingCost || 0);
        setTaxAmount(response.data.taxAmount || 0);
      }
    } catch (error) {
      console.error('Failed to load cart from database:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up periodic sync
  useEffect(() => {
    if (!userId) return;

    const syncInterval = setInterval(() => {
      syncCartWithDatabase(userId);
    }, SYNC_INTERVAL);

    return () => clearInterval(syncInterval);
  }, [userId, syncCartWithDatabase]);

  const value = {
    items,
    itemCount: items.length,
    subtotal,
    shippingCost,
    shippingMethod,
    taxAmount,
    total,
    isLoading,
    isSyncing,
    lastSyncTime,
    addToCart,
    removeFromCart,
    updateQuantity,
    setShipping,
    clearCart,
    syncCartWithDatabase,
    loadCartFromDatabase,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
