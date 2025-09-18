import apiClient from '../lib/axios';
import { API_CONFIG } from '../lib/config';
import { getErrorMessage } from '../lib/types';

// API types aligned with Foody API
export interface FoodyRestaurantListItem {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string; // data URL svg
  images: string[];
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  distance?: number;
}

export interface FoodyRestaurantDetail extends FoodyRestaurantListItem {
  averageRating?: number;
  coordinates?: { lat: number; long: number };
  totalMenus?: number;
  totalReviews?: number;
  menus?: Array<{
    id: number;
    foodName: string;
    price: number;
    type: string;
    image: string;
  }>;
  reviews?: Array<{
    id: number;
    star: number;
    comment: string;
    createdAt: string;
    user: { id: number; name: string };
  }>;
}

export interface FoodyRecommendationItem {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  reviewCount: number;
  distance?: number;
  sampleMenus: Array<{
    id: number;
    foodName: string;
    price: number;
    type: string;
    image: string;
  }>;
  isFrequentlyOrdered: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const restaurantService = {
  // GET /api/resto?page=&limit=
  async getRestaurants(params?: { page?: number; limit?: number }): Promise<{
    success: true;
    data: {
      restaurants: FoodyRestaurantListItem[];
      pagination: PaginationMeta;
    };
  }> {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.RESTAURANT.LIST,
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to fetch restaurants'));
    }
  },

  // GET /api/resto/recommended (requires bearer if provided)
  async getRecommended(): Promise<{
    success: true;
    data: { recommendations: FoodyRecommendationItem[]; message: string };
  }> {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.RESTAURANT.RECOMMENDED
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Failed to fetch recommendations')
      );
    }
  },

  // GET /api/resto/:id?limitMenu=&limitReview=
  async getRestaurantById(
    id: number,
    params?: {
      limitMenu?: number;
      limitReview?: number;
    }
  ): Promise<{ success: boolean; data: FoodyRestaurantDetail }> {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.RESTAURANT.DETAIL}/${id}`,
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, 'Failed to fetch restaurant detail')
      );
    }
  },
};
