import apiClient from '../lib/axios';
import { API_CONFIG } from '../lib/config';
import { getErrorMessage } from '../lib/types';

export interface CartMenuItem {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface CartItem {
  id: number;
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  menu: CartMenuItem;
  quantity: number;
  itemTotal: number;
}

export interface CartGroup {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: {
    cart: CartGroup[];
    summary: CartSummary;
  } | null;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    try {
      const response = await apiClient.get<CartResponse>(
        API_CONFIG.ENDPOINTS.CART.BASE
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to load cart'));
    }
  },

  async addItem(params: {
    restaurantId: number;
    menuId: number;
    quantity: number;
  }): Promise<CartResponse> {
    try {
      const response = await apiClient.post<CartResponse>(
        API_CONFIG.ENDPOINTS.CART.BASE,
        params
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to add item to cart'));
    }
  },

  async clear(): Promise<CartResponse> {
    try {
      const response = await apiClient.delete<CartResponse>(
        API_CONFIG.ENDPOINTS.CART.BASE
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to clear cart'));
    }
  },

  async updateQuantity(
    cartItemId: number,
    quantity: number
  ): Promise<CartResponse> {
    try {
      const response = await apiClient.put<CartResponse>(
        `${API_CONFIG.ENDPOINTS.CART.ITEM}/${cartItemId}`,
        { quantity }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to update cart item'));
    }
  },

  async removeItem(cartItemId: number): Promise<CartResponse> {
    try {
      const response = await apiClient.delete<CartResponse>(
        `${API_CONFIG.ENDPOINTS.CART.ITEM}/${cartItemId}`
      );
      console.log('Remove item API response:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Remove item API error:', error);
      throw new Error(getErrorMessage(error, 'Failed to remove cart item'));
    }
  },
};
