import apiClient from '../lib/axios';
import { API_CONFIG } from '../lib/config';
import { getErrorMessage } from '../lib/types';

// Types for order
export interface OrderItem {
  menuId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  restaurantId: number;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  notes?: string;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  items: OrderItem[];
  totalAmount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'delivered'
    | 'cancelled';
  deliveryAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Order service
export const orderService = {
  // Checkout current cart
  async checkout(params: {
    paymentMethod: string;
    deliveryAddress: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: unknown;
  }> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ORDER.CHECKOUT,
        params
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to checkout'));
    }
  },
  // Create new order
  async createOrder(
    orderData: CreateOrderData
  ): Promise<{ success: boolean; data: Order }> {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.ORDER.CREATE,
        orderData
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to create order'));
    }
  },

  // Get user orders
  async getUserOrders(
    page = 1,
    limit = 10
  ): Promise<{ success: boolean; data: { orders: Order[] } }> {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.ORDER.MY_ORDERS,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to fetch orders'));
    }
  },

  // Get order by ID
  async getOrderById(id: number): Promise<{ success: boolean; data: Order }> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.ORDER.DETAIL}/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to fetch order'));
    }
  },

  // Cancel order
  async cancelOrder(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ORDER.DETAIL}/${id}/cancel`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to cancel order'));
    }
  },

  // Update order status (admin-ish or mock)
  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<{ success: boolean; data?: unknown; message?: string }> {
    try {
      const response = await apiClient.put(
        `${API_CONFIG.ENDPOINTS.ORDER.STATUS}/${id}/status`,
        { status }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to update order status'));
    }
  },
};
