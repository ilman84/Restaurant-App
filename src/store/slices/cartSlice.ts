import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartService, CartGroup, CartSummary } from '@/services/cartService';

interface CartState {
  groups: CartGroup[];
  summary: CartSummary;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  groups: [],
  summary: {
    totalItems: 0,
    totalPrice: 0,
    restaurantCount: 0,
  },
  count: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch cart');
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    params: { restaurantId: number; menuId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartService.addItem(params);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to add item to cart');
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await cartService.updateQuantity(cartItemId, quantity);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to update cart item');
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      const response = await cartService.removeItem(cartItemId);
      if (response.success) {
        // Return the data if available, otherwise return null to keep optimistic update
        return response.data || null;
      }
      return rejectWithValue('Failed to remove cart item');
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clear();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to clear cart');
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.groups = [];
      state.summary = {
        totalItems: 0,
        totalPrice: 0,
        restaurantCount: 0,
      };
      state.count = 0;
      state.loading = false;
      state.error = null;
    },
    incrementCount: (state) => {
      state.count += 1;
    },
    // Optimistic update for immediate UI feedback
    optimisticAddToCart: (state) => {
      state.count += 1;
    },
    // Optimistic update for quantity changes
    optimisticUpdateQuantity: (
      state,
      action: PayloadAction<{ cartItemId: number; quantity: number }>
    ) => {
      const { cartItemId, quantity } = action.payload;
      const group = state.groups.find((g) =>
        g.items.some((item) => item.id === cartItemId)
      );
      if (group) {
        const item = group.items.find((item) => item.id === cartItemId);
        if (item) {
          const oldQuantity = item.quantity;
          item.quantity = quantity;
          item.itemTotal = item.menu.price * quantity;
          group.subtotal = group.items.reduce((sum, i) => sum + i.itemTotal, 0);
          state.summary.totalItems =
            state.summary.totalItems - oldQuantity + quantity;
          state.summary.totalPrice = state.groups.reduce(
            (sum, g) => sum + g.subtotal,
            0
          );
          state.count = state.summary.totalItems;
        }
      }
    },
    // Optimistic update for removing items
    optimisticRemoveFromCart: (state, action: PayloadAction<number>) => {
      const cartItemId = action.payload;

      // Find and remove the item
      for (let i = 0; i < state.groups.length; i++) {
        const group = state.groups[i];
        const itemIndex = group.items.findIndex((it) => it.id === cartItemId);
        if (itemIndex !== -1) {
          // Remove the item
          group.items.splice(itemIndex, 1);

          // If group is empty, remove the group
          if (group.items.length === 0) {
            state.groups.splice(i, 1);
          } else {
            // Recalculate group subtotal
            group.subtotal = group.items.reduce(
              (sum, it) => sum + it.itemTotal,
              0
            );
          }
          break;
        }
      }

      // Recalculate summary
      state.summary.totalItems = state.groups.reduce(
        (sum, group) =>
          sum + group.items.reduce((s, item) => s + item.quantity, 0),
        0
      );
      state.summary.totalPrice = state.groups.reduce(
        (sum, group) => sum + group.subtotal,
        0
      );
      state.summary.restaurantCount = state.groups.length;
      state.count = state.summary.totalItems;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const payload = (action.payload as any) || {};
        const groups = payload.cart || [];
        const summary = payload.summary || {
          totalItems: 0,
          totalPrice: 0,
          restaurantCount: 0,
        };
        state.groups = groups;
        state.summary = summary;
        state.count = summary.totalItems ?? 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        // Don't set loading to true for addToCart to avoid UI blocking
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const payload = (action.payload as any) || {};
        if (!payload || !Array.isArray(payload.cart)) {
          // Keep optimistic UI; server didn't return a valid cart
          return;
        }
        const groups = payload.cart as any[];
        const summary = payload.summary || {
          totalItems: groups.reduce(
            (sum: number, g: any) =>
              sum +
              (g.items || []).reduce(
                (s: number, it: any) => s + (it.quantity || 0),
                0
              ),
            0
          ),
          totalPrice: groups.reduce(
            (sum: number, g: any) => sum + (g.subtotal || 0),
            0
          ),
          restaurantCount: groups.length,
        };
        state.groups = groups as any;
        state.summary = summary as any;
        state.count = (summary as any).totalItems ?? 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
        // Revert optimistic update on error
        state.count = Math.max(0, state.count - 1);
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        // Don't set loading to true to avoid UI blocking
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const payload = (action.payload as any) || {};
        if (!payload || !Array.isArray(payload.cart)) {
          // Keep optimistic UI if server response is not structured
          return;
        }
        const groups = payload.cart as any[];
        const summary = payload.summary || {
          totalItems: groups.reduce(
            (sum: number, g: any) =>
              sum +
              (g.items || []).reduce(
                (s: number, it: any) => s + (it.quantity || 0),
                0
              ),
            0
          ),
          totalPrice: groups.reduce(
            (sum: number, g: any) => sum + (g.subtotal || 0),
            0
          ),
          restaurantCount: groups.length,
        };
        state.groups = groups as any;
        state.summary = summary as any;
        state.count = (summary as any).totalItems ?? 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload as string;
        // Revert optimistic update on error by refetching
        // In a real app, you'd want to track the previous state
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && Array.isArray(payload.cart)) {
          // Only update if we have actual cart data from API
          const groups = payload.cart as any[];
          const summary = payload.summary || {
            totalItems: groups.reduce(
              (sum: number, g: any) =>
                sum +
                (g.items || []).reduce(
                  (s: number, it: any) => s + (it.quantity || 0),
                  0
                ),
              0
            ),
            totalPrice: groups.reduce(
              (sum: number, g: any) => sum + (g.subtotal || 0),
              0
            ),
            restaurantCount: groups.length,
          };
          state.groups = groups as any;
          state.summary = summary as any;
          state.count = (summary as any).totalItems ?? 0;
        }
        // If payload is null or invalid, keep the optimistic UI update
        // This prevents the API from overriding our optimistic update
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        const payload = (action.payload as any) || {};
        if (!payload || !Array.isArray(payload.cart)) {
          state.groups = [] as any;
          state.summary = {
            totalItems: 0,
            totalPrice: 0,
            restaurantCount: 0,
          } as any;
          state.count = 0;
          return;
        }
        const groups = payload.cart as any[];
        const summary = payload.summary || {
          totalItems: groups.reduce(
            (sum: number, g: any) =>
              sum +
              (g.items || []).reduce(
                (s: number, it: any) => s + (it.quantity || 0),
                0
              ),
            0
          ),
          totalPrice: groups.reduce(
            (sum: number, g: any) => sum + (g.subtotal || 0),
            0
          ),
          restaurantCount: groups.length,
        };
        state.groups = groups as any;
        state.summary = summary as any;
        state.count = (summary as any).totalItems ?? 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetCart,
  incrementCount,
  optimisticAddToCart,
  optimisticUpdateQuantity,
  optimisticRemoveFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
