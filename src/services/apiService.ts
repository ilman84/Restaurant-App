import { getErrorDetails } from '../lib/types';

// Generic API response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper function untuk handle API responses
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    return response.data;
  } else {
    const errorMessage = response.errors?.join(', ') || response.message;
    throw new Error(errorMessage);
  }
}

// Helper function untuk handle API errors
export function handleApiError(error: unknown, fallback: string): never {
  const errorDetails = getErrorDetails(error);
  const errorMessage =
    errorDetails.errors?.join(', ') || errorDetails.message || fallback;
  throw new Error(errorMessage);
}
