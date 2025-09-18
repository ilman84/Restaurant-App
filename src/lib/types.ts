// Common types for error handling
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
  };
}

// Type guard untuk error
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

// Helper function untuk extract error message
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    const data = error.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(', ');
    }
    return data?.message || fallback;
  }
  return fallback;
}

// Helper function untuk extract error details
export function getErrorDetails(error: unknown): {
  message: string;
  errors?: string[];
} {
  if (isApiError(error)) {
    const data = error.response?.data;
    return {
      message: data?.message || 'An error occurred',
      errors: data?.errors,
    };
  }
  return { message: 'An error occurred' };
}
