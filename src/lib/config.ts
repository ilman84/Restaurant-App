import { ENV } from './env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TOKEN: ENV.API_TOKEN,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile',
    },
    USER: {
      PROFILE: '/api/auth/profile',
      UPDATE: '/api/auth/profile',
    },
    RESTAURANT: {
      LIST: '/api/resto',
      RECOMMENDED: '/api/resto/recommended',
      DETAIL: '/api/resto',
    },
    ORDER: {
      CREATE: '/api/order',
      LIST: '/api/order',
      DETAIL: '/api/order',
      CHECKOUT: '/api/order/checkout',
      MY_ORDERS: '/api/order/my-order',
      STATUS: '/api/order',
    },
    REVIEW: {
      CREATE: '/api/review',
      BY_RESTAURANT: '/api/review/restaurant',
      MINE: '/api/review/my-reviews',
      BASE: '/api/review',
    },
    CART: {
      BASE: '/api/cart',
      ITEM: '/api/cart',
    },
  },
};
