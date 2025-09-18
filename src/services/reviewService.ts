import apiClient from '@/lib/axios';
import type { AxiosError } from 'axios';
import { API_CONFIG } from '@/lib/config';

export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: number;
  star: number; // 1-5
  comment: string;
}

export interface ReviewItem {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user?: { id: number; name: string };
  restaurant?: { id: number; name: string; logo?: string };
}

export interface CreateReviewResponse {
  success: boolean;
  message?: string;
  data?: { review: ReviewItem };
}

export interface RestaurantReviewsResponse {
  success: boolean;
  data?: {
    restaurant: { id: number; name: string; star: number };
    reviews: ReviewItem[];
    statistics: {
      totalReviews: number;
      averageRating: number;
      ratingDistribution: Record<string, number>;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MyReviewsResponse {
  success: boolean;
  data?: {
    reviews: ReviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const reviewService = {
  async create(payload: CreateReviewPayload) {
    try {
      const { data } = await apiClient.post<CreateReviewResponse>(
        API_CONFIG.ENDPOINTS.REVIEW.CREATE,
        payload
      );
      return data;
    } catch (error: unknown) {
      // Handle axios errors and return them as response objects
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError && axiosError.response) {
        const status = axiosError.response.status;
        let message =
          axiosError.response.data?.message || 'Failed to create review';

        // Provide specific messages for common error codes
        if (status === 409) {
          message = 'You have already reviewed this restaurant for this order.';
        } else if (status === 400) {
          message =
            axiosError.response.data?.message ||
            'Invalid review data. Please check your input.';
        } else if (status === 401) {
          message = 'Please log in to submit a review.';
        } else if (status === 404) {
          message = 'Order or restaurant not found.';
        }

        return {
          success: false,
          message,
          data: {
            ...(axiosError.response.data as object),
            status,
          },
        };
      }
      // Handle network or other errors
      return {
        success: false,
        message:
          (error instanceof Error ? error.message : undefined) ||
          'Failed to create review',
      };
    }
  },

  async getByRestaurant(restaurantId: number, page = 1, limit = 10) {
    const url = `${API_CONFIG.ENDPOINTS.REVIEW.BY_RESTAURANT}/${restaurantId}?page=${page}&limit=${limit}`;
    const { data } = await apiClient.get<RestaurantReviewsResponse>(url);
    return data;
  },

  async getMyReviews(page = 1, limit = 10) {
    const url = `${API_CONFIG.ENDPOINTS.REVIEW.MINE}?page=${page}&limit=${limit}`;
    const { data } = await apiClient.get<MyReviewsResponse>(url);
    return data;
  },

  async update(
    reviewId: number,
    payload: Partial<Pick<CreateReviewPayload, 'star' | 'comment'>>
  ) {
    const url = `${API_CONFIG.ENDPOINTS.REVIEW.BASE}/${reviewId}`;
    const { data } = await apiClient.put<CreateReviewResponse>(url, payload);
    return data;
  },

  async remove(reviewId: number) {
    const url = `${API_CONFIG.ENDPOINTS.REVIEW.BASE}/${reviewId}`;
    const { data } = await apiClient.delete<{
      success: boolean;
      message?: string;
    }>(url);
    return data;
  },
};

export default reviewService;
