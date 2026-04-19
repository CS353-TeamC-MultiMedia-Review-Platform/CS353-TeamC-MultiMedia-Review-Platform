/**
 * API Configuration
 * Uses environment variables in production, falls back to localhost for development
 */

export const getAPIBaseUrl = (): string => {
  // Development environment
  if (typeof window === "undefined") {
    // SSR - use full URL
    return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  }

  // Client-side
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // Development fallback
  return "http://localhost:5001";
};

export const API_BASE_URL = getAPIBaseUrl();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // User Data
  USER_DATA: (uid: string) => `/data/${uid}`,
  SAVE_DATA: "/save",

  // Reviews
  GET_REVIEWS: "/reviews",
  GET_REVIEW: (id: string) => `/reviews/${id}`,
  GET_USER_REVIEWS: (userId: string) => `/reviews/user/${userId}`,
  GET_MEDIA_REVIEWS: (title: string) => `/reviews/media/${title}`,
  CREATE_REVIEW: "/reviews/create",
  UPDATE_REVIEW: (id: string) => `/reviews/${id}`,
  DELETE_REVIEW: (id: string) => `/reviews/${id}`,
  LIKE_REVIEW: (id: string) => `/reviews/${id}/helpful`,
};

// Helper function to build full URLs
export const buildApiUrl = (
  endpoint: string | ((arg: string) => string),
  arg?: string,
): string => {
  const fullEndpoint =
    typeof endpoint === "function" && arg ? endpoint(arg) : endpoint;
  return `${API_BASE_URL}${fullEndpoint}`;
};
