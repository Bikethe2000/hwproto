import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const useCartItems = () => {
  const { items } = useCart();
  return items;
};

export const useCartTotals = () => {
  const { subtotal, shippingCost, taxAmount, total } = useCart();
  return { subtotal, shippingCost, taxAmount, total };
};

export const useAddToCart = () => {
  const { addToCart } = useCart();
  return addToCart;
};

export const useRemoveFromCart = () => {
  const { removeFromCart } = useCart();
  return removeFromCart;
};

export const useUpdateQuantity = () => {
  const { updateQuantity } = useCart();
  return updateQuantity;
};

export const useCartSync = () => {
  const { syncCartWithDatabase, loadCartFromDatabase, isSyncing } = useCart();
  return { syncCartWithDatabase, loadCartFromDatabase, isSyncing };
};
